import Subject from '../entities/Subject'
import Scraper from './Scraper'
import config from '../config.json'
import { sortSubjects } from '../normalizers/sorters'
import { ServiceResult } from '../types'
import Key from '../entities/Key'


export default class MapSubjects {
    public semesterID: number
    public baseURL: string
    public subjectKeys: Key[]

    constructor (semesterID: number) {
        this.semesterID = semesterID
        this.baseURL = config.scraping.baseURLForSubjects
        this.subjectKeys = []
    }

    /**
     * @returns {Promise} - {success, errors?, data?}
     */
    public async getSubjects (): Promise<ServiceResult> {
        let result: ServiceResult = { success: false }
        const url = this.baseURL + this.semesterID

        console.log(`Getting subjects for semester: ${this.semesterID}. From: ${url}`)

        try {
          const pageContent = await Scraper.scrap(url, 'latin1')
          let asignaturas = this.processHTML(pageContent)
          if(!asignaturas) throw 'Hubo un error al completar las asignaturas'
          asignaturas = sortSubjects(asignaturas)

          result.data = asignaturas
          result.success = true
        } catch(err) {
          result.errors = err
        }

        return result;
    }

    /**
     * If the font change, this function should be adapted to extract the specified
     * data from the new page.
     * @param {String} html - the html content from where will be extracted the
     * subjects.
     * @return {Subject[]} the extracted subjects.
     */
    private processHTML (html: string): Subject[] {
      const filter = element => element.children[0].data

      const subjectElementsClassifier = {
        cssSelector: 'td[width="87%"].asignatura > strong',
        html: html,
        filter: filter
      }

      const keyElementsClassifier = {
        cssSelector: 'td[width=44].grupo > div',
        html: html,
        filter: filter,
        steps: {
          init: 1,
          size: 2
        }
      }

      const urlsElementsClassifier = {
        cssSelector: 'td[width=51].nombre > span.grupo',
        html: html,
        filter: (element: CheerioElement): string => {
          let generic_link = element?.children[1]?.attribs?.href
          return config.scraping.baseURLForWorkPlans + generic_link /*here should be generic_link*/
        }
      }

      let subjectNames = Scraper.getElementsFromHTML(subjectElementsClassifier)
      let keys = Scraper.getElementsFromHTML(keyElementsClassifier)
      let urls = Scraper.getElementsFromHTML(urlsElementsClassifier)

      if (subjectNames.length !== keys.length || subjectNames.length !== urls.length) {
          throw 'There was a problem while trying to process the specified html'
      }

      let asignaturas = this.classifySubjects(subjectNames, keys, urls)
      return this.mapImportance(asignaturas)
    }

    /**
     * Groups the extracted info from processHTML into Subject objects.
     * @param {String[]} names - the names of the subjects
     * @param {String[]} keys - the real key of the subject (that obe generated
     * by the university).
     * @param {String[]} pt_urls - an array of URL for the work plans for each 
     * subject.
     * @returns {Subject[]} the grouped data into Subject objects.
     */
    private classifySubjects (names: string[], keys: string[], pt_urls: string[]): Subject[] {
      let subjects = []

      for (let subjectIndex in names) {
          let subject = new Subject(
              this.semesterID,
              names[subjectIndex],
              (
                keys[subjectIndex]
                .replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")
              ).trim(),
              pt_urls[subjectIndex]
          )

          subjects.push(subject)
          this.subjectKeys.push(subject.key)
      }

      return subjects
    }

    /**
     * specify if the letter property of the Key object of each Subject should
     * be considered to group the subject. Therefore, sets to true or false the
     * "considerLetter" property of each "key" property of each Subject.
     * @param {Subject[]} subjects - the array of Subject objects that will be
     * mapped.
     */
    public mapImportance (subjects: Subject[]): Subject[] {
      for (let i = 0; i < subjects.length; i++) {
        let current = subjects[i]
        if (typeof current.key.letter !== 'string') continue
        let coincidences = subjects.filter( sub => (
          current.key.number == sub.key.number
        ))
        if (coincidences.length > 1) (subjects[i].key.conciderLetter = true)
      }
      return subjects
    }
}
