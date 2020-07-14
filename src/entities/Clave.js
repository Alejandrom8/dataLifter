class Clave{
    constructor(clave){
        this.clave = clave;
        this.number = this.clave.split('').slice(0, 4).join('');
        this.letter = this.clave[4] || null;
        this.conciderLetter = false;
    }
}

module.exports = Clave;