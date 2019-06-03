import React from 'react';
import Game from './Game';
class GameLevel extends React.Component{
   render(){
        return(
            <div>
            <button className="button" disabled={this.props.levelName !== this.props.currentLevelInProgress}
                    onClick={()=>{this.props.onLevelStartClicked(this.props.levelName)}}>
                {`Start Level ${this.props.levelName}`}
            </button>
            {this.props.levelTeams.map((item, index)=>{
                return(
                    <Game 
                        key={index} 
                        gameDetails={{team1: item.team1, team2: item.team2, team1Winner: item.team1Winner, team2Winner: item.team2Winner}}/>
                );
            })}
                
                
            </div>
        );
    }
}

export default GameLevel;