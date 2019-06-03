import React from 'react';
import GameLevel from './GameLevel';
import GameInProgressModal from './GameInprogressModal';
class Tournament extends React.Component{
    state={
        teamsTotal:[],
        byesTotal:[],
        byes:[],
        prevLevelInProgress:false,
        currentLevelInProgress:1,
        levels:[], //array of each level array of individual games array,
        winnerTeam:{},
        isOpen : false 
    }

    componentDidMount(){
        let teamsJson = "";
        let teamCount = 0;
        let teamsArray = [];
        let byesArray = [];
        let byesCount = 0;
        let levelsCount = 0;
        const that= this;
        //read the json here
        $.getJSON('https://raw.githubusercontent.com/bttmly/nba/master/data/teams.json', function(data) {
            console.log("Teams JSON", data);
            teamsJson = data;
            $.each(data, function (index, value) {
                teamsArray.push(value);       // PUSH THE VALUES INSIDE THE ARRAY.
            });
        })
        .done(function() {
            teamCount = Object.keys(teamsJson).length;
            console.log("Team count", teamCount);
            console.log("Team Array", teamsArray);
            if(teamCount<8) 
            {
                return(alert("Not enough teams for the tournament"));
            }
            let teamSizeStandardArray = [2,4,8,16,32,64,128,256];
            teamSizeStandardArray.push(teamCount);
            teamSizeStandardArray = teamSizeStandardArray.sort((a,b)=>{
                return a-b;
            });
            //get total number of levels to be played 
            levelsCount = teamSizeStandardArray.findIndex((item)=>{return item==teamCount}) + 1;
            console.log("Levels Count", levelsCount);
            byesCount = teamSizeStandardArray[levelsCount] - teamCount;
            console.log("Byes count", byesCount);
            //if byes is != 0, pop that many teams from main teams array and push to byes array
            if(byesCount>0){
                for (let i = 0; i < byesCount; i++) {
                    const tempSpliced = teamsArray.splice(Math.floor(Math.random()*teamsArray.length), 1);
                    byesArray.push(tempSpliced[0]);
                }
            }
            console.log("After splice", byesArray, teamsArray);
            
            for (let i = 0; i < levelsCount; i++) {
                if(i==0){//level-1
                    //shuffle the teamsArray
                    const teamsArrayShuffled = that.shuffle(teamsArray); 
                    const level1 = [];   
                    for (let j = 0; j < teamsArrayShuffled.length; j=j+2) {
                        const temp2Teams = {team1: teamsArrayShuffled[j], team2: teamsArrayShuffled[j+1], team1Winner:false, team2Winner: false};
                        level1.push(temp2Teams);
                    }
                    that.setState((prevState)=>{
                        return {
                            levels: [...prevState.levels, level1] 
                        }});
                    console.log("level-1", that.state.levels);
                }
                else if(i==1){//level-2
                    const tempLevel2Count = byesCount + that.state.levels[i-1].length;
                    console.log("tempLevel2Count", tempLevel2Count);
                    let teamsL2 = [];
                    let level2 = [];
                    byesArray.forEach(element => {
                        teamsL2.push(element);
                    });

                    for(var k=0; k < that.state.levels[i-1].length; k++){
                        teamsL2.push({abbreviation: "TBD", location:"", simpleName:"", teamId:Math.random(), teamName:""});
                    }
                    const teamsL2Shuffled = that.shuffle(teamsL2); 

                    for (let k = 0; k < teamsL2Shuffled.length; k=k+2) {
                        const temp2Teams = {team1: teamsL2Shuffled[k], team2: teamsL2Shuffled[k+1], team1Winner:false, team2Winner: false};
                        level2.push(temp2Teams);
                    }

                    that.setState((prevState)=>{
                        return {
                            levels: [...prevState.levels, level2]
                        }});
                    console.log("level-2", that.state.levels);
                }
                else{
                    const prevLevelCount = that.state.levels[i-1].length;
                    const teamsOtherLevels = [];
                    const otherLevels = [];
                    for(var k=0; k < prevLevelCount; k++){
                        teamsOtherLevels.push({abbreviation: "TBD", location:"", simpleName:"", teamId:Math.random(), teamName:""});
                    }
                    for (let k = 0; k < teamsOtherLevels.length / 2; k++) {
                        const temp2Teams = {team1: teamsOtherLevels[k], team2: teamsOtherLevels[k+1], team1Winner:false, team2Winner: false};
                        otherLevels.push(temp2Teams);
                    }
                    that.setState((prevState)=>{
                        return {
                            levels: [...prevState.levels, otherLevels]
                        }});
                }
            }
            that.setState({teamsTotal: teamCount, byesTotal: byesCount, byes: byesArray});
            console.log("levelsssssss", that.state);
        })
        .fail(function() {
            console.log( "error" );
        });
    }

    shuffle = (array) => {//used a readymade function for shuffling an array
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;   
    }

    onLevelStartClicked = (currentLevelInProgress)=>{
        this.setState({isOpen: !this.state.isOpen});
        setTimeout(() => {
            //call a function by passing currentLevelInProgress
            this.setState({isOpen: !this.state.isOpen});
            this.getWinners(currentLevelInProgress);
        }, 5000);
    }

    getWinners = (currentLevelInProgress)=>{
        let levelTeams = this.state.levels[currentLevelInProgress-1];
        let levelWinners = [];
        levelWinners = levelTeams.map((item, index)=>{
            const randWinner = Math.floor(Math.random() * 2) + 1;//random number between 1 and 2
            const tempArray = Object.keys(item).map((subItem)=>{
                return item[subItem];
            });
            randWinner-1 === 0 ? levelTeams[index].team1Winner = true : levelTeams[index].team2Winner = true;
            return tempArray[randWinner-1];
        })
        this.setState((prevState)=>{ //update the levelTeam with all the winners
            const tempLevels = prevState.levels.map((item, j) => {
                if (j === currentLevelInProgress-1) {
                  return levelTeams;
                } else {
                  return item;
                }
              });
            return{
                levels: tempLevels
            }
        })
        //check if this is final match. Else call setNextLevelTeams
        if(levelTeams.length > 1){//not finals        
            this.setNextLevelTeams(currentLevelInProgress, levelWinners);
        }
        else{//setstate for winner
            this.setState({
                winnerTeam: levelWinners[0],
                currentLevelInProgress:0
            });
        }
    }

    setNextLevelTeams = (currentLevelInProgress, levelWinners)=>{
        let nextLevelTeams;
        let nextLevel = [];
        if(currentLevelInProgress==1)//level 2 might have byes
            nextLevelTeams = levelWinners.concat(this.state.byes);
        else
            nextLevelTeams = levelWinners;
        for (let k = 0; k < nextLevelTeams.length; k=k+2) {
            const temp2Teams = {team1: nextLevelTeams[k], team2: nextLevelTeams[k+1], team1Winner:false, team2Winner: false};
            nextLevel.push(temp2Teams);
        }
        console.log(nextLevel, nextLevelTeams);
        this.setState({currentLevelInProgress: currentLevelInProgress+1},
            ()=>{
                this.setState((prevState)=>{ //update the levelTeam with all the winners
                    const tempLevels = prevState.levels.map((item, j) => {
                        if (j === this.state.currentLevelInProgress-1) {
                          return nextLevel;
                        } else {
                          return item;
                        }
                      });
                    return{
                        levels: tempLevels
                    }
                })
            });
        //setState currentLevelInProgress to +1
    }

    render(){
        return(
            <div>
            <p className="titles-vs">Total Teams: {this.state.teamsTotal}</p>
            <p className="titles-vs">Total Byes: {this.state.byesTotal}</p>
            <p className="titles-vs">Total Levels: {this.state.levels.length}</p>
            <div className="level-container">
                
                <GameInProgressModal 
                    isModalOpen = {this.state.isOpen} 
                    closeModalHandle = {this.closeModalHandle} 
                    closeModal={this.closeModal}
                    currentLevelInProgress = {this.state.currentLevelInProgress}
                    content={`Level-${this.state.currentLevelInProgress} in progress...`}
                />
                
                {this.state.levels.map((item, index)=>{
                    return(
                        <GameLevel
                            onLevelStartClicked={this.onLevelStartClicked}  
                            currentLevelInProgress = {this.state.currentLevelInProgress}
                            key={index} 
                            levelName={index+1} 
                            levelTeams={item} 
                        />
                    );
                })}
            </div>
            </div>
        );
    }
}

export default Tournament;