//require middleware
const db = require('../database/db');

//create class
class Contest{
    constructor(data){
        if(data.id){
            this.id = data.id;
        }

        this.contestName = data.contestName;
        this.contestLink = data.contestLink;
        this.contestEnd = data.contestEnd;
        this.contestImage = data.contestImage;
    }

    saveToDB(){
        return db('Contest')
            .returning('id')
            .insert(this)
            .then( (arrayIds) => {
                return arrayIds[0];
            });
    }

    editTodB(){
        return db('Contest')
            .where('id', this.id)
            .update(this)
            .then( (arrayIds) => {
                return arrayIds[0];
            });
    }

    //Pulls all contests
    static getContests(){
        return db('Contest')
            .orderBy('id', 'desc')
            .then( (contestsData) =>{
                return contestsData.map( (contestData) =>{
                    return new Contest(contestData);
                });
            });
    }

    //Pulls all contests that have not yet expired
    static getOngoingContests(){

        // let now = new Date().toISOString().slice(0,16) .replace(/T/g, " ");

        let now = new Date().getTime();

        return db('Contest')
            .where('contestEnd' ,'>', now)
            .orderBy('contestEnd', 'asc')
            .then( (contestsData) =>{
                return contestsData.map( (contestData) =>{
                    return new Contest(contestData);
                });
            });
    }

    //pulls a single contest by their id
    static getContestById(id){
        return db('Contest')
            .where('id', id)
            .then( (contestsData) => {
                const contestData = contestsData[0];
                let contest = new Contest(contestData);
                return contest;
            });
    };





}

module.exports = Contest;