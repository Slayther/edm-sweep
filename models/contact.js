//require middleware
const db = require('../database/db');

//create class
class Contact{
    constructor(data){
        if(data.id){
            this.id = data.id;
        }

        this.subject = data.subject;
        this.name = data.name;
        this.email = data.email;
        this.message = data.message;
    }

    saveToDB(){
        return db('Contact')
            .returning('id')
            .insert(this)
            .then( (arrayIds) => {
                console.log(arrayIds[0]);
                return arrayIds[0];
            });
    }

    editTodB(){
        return db('Contest')
            .where('id', this.id)
            .update(this)
            .then( (arrayIds) => {
                console.log(arrayIds[0]);
                return arrayIds[0];
            });
    }

    static getContact(){
        return db('Contact')
            .orderBy('id', 'desc')
            .then( (contactsData) =>{
                return contactsData.map( (contactData) =>{
                    console.log(contactData);
                    return new Contact(contactData);
                });
            });
    }

    static getContactById(id){
        return db('Contact')
            .where('id', id)
            .then( (contactsData) => {
                const contactData = contactsData[0];
                let contact = new Contact(contactData);
                return contact;
            })
    }

}

module.exports = Contact;