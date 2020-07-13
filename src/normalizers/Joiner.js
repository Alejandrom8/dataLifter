class Joiner{
    constructor(pt, mt){
        this.pt = pt;
        this.mt = mt;
    }

    getSubjects(){
        let joined_data = this.joinThem(this.pt, this.mt);
        return joined_data;
    }

    joinThem(){
        let {pt, mt} = this;

        for(let i = 0; i < pt.length; i++){
            let current = pt[i];
            let key = current.clave;
            let [apuntes, actividades] = this.searchCoincidences(key, mt);
            pt[i].apunteURL = apuntes.length == 1 ? apuntes[0] : apuntes;
            pt[i].actividadesURL = actividades.length == 1 ? actividades[0] : actividades;
        }
        return pt;
    }

    searchCoincidences(key, mt){
        //ISSUE - cuando en pt se especifica una letra fuera de orden [a, c, i], 
        //en mt se genera otra deacuerdo al orden en el que se leen las materias,
        //lo que hace que no matche en ningun elemento.
        let apuntes = [], actividades = [];
        for(let i = 0; i < mt.length; i++){
            if(typeof key.letter == 'string'){
                if(mt[i].clave.number == key.number && 
                    mt[i].clave.letter == key.letter){
                    apuntes.push(mt[i].apunteURL);
                    actividades.push(mt[i].actividadesURL);
                    break;
                }
            }else{
                if(mt[i].clave.number == key.number){
                    apuntes.push(mt[i].apunteURL);
                    actividades.push(mt[i].actividadesURL);
                }
            }
        }
        return [apuntes, actividades];
    } 
}

module.exports = Joiner;