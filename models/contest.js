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
    }

    saveToDB(){
        return db('Contest')
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

    //Pulls all contests
    static getContests(){
        return db('Contest')
            .orderBy('id', 'desc')
            .then( (contestsData) =>{
                return contestsData.map( (contestData) =>{
                    console.log(contestData);
                    return new Contest(contestData);
                });
            });
    }

    //Pulls all contests that have not yet expired
    static getOngoingContests(){

        var now = new Date().toISOString().slice(0,16) .replace(/T/g, " ");

        return db('Contest')
            .where('contestEnd' ,'>', now)
            .then( (contestsData) =>{
                return contestsData.map( (contestData) =>{
                    console.log(contestsData);
                    console.log(contestData);
                    console.log(now);
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
            })
    }



}

module.exports = Contest;