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
        this.endDate = data.endDate;
        this.endTime = data.endTime;
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

    //not working
    static getOngoingContests(){

        const now = new Date(Date.now());
        return db('Contest')
            .where('endDate', '>', now)
            .then( (contestsData) =>{
                return contestsData.map( (contestData) =>{
                    console.log(contestData);
                    console.log(now);
                    return new Contest(contestData);
                });
            });
    }

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