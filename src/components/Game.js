import React from 'react';

const Game = (props)=>(
    <div className="content-container">
    <div className="game-card-group">
    <div className="input-group__item">
        <p className={props.gameDetails.team1Winner ? "titles-game-winner": "titles-game"}>{props.gameDetails.team1.abbreviation} </p>
        <p className="titles-vs">vs</p>
        <p className={props.gameDetails.team2Winner ? "titles-game-winner": "titles-game"}>{props.gameDetails.team2.abbreviation} </p>
    </div>
    </div>
    </div>
);

export default Game;