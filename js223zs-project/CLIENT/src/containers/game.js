import React from 'react';

import Done from '../components/done';
import Board from '../components/board';
import GamePieces from '../components/gamePieces';
import Player from '../components/player';
import socket from '../socket';
import Rules from '../components/rules';

import { isNullOrUndefined } from 'util';

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        const rows = props.value.rows;
        const columns = props.value.columns;
        var squares = [];    // nodes in gameboard

        // Initialize gameboard node content
        for (var i = 0; i < rows*columns; i++) {
            squares.push({text:"",color:"blue",backgroundColor:"white", roundMoves:0, occupiedBy: "", occupiedByCCTV: false});
        }

        // Initialize Game state
        this.state = {
            winner: '',
            infoFromServer: "",
            client: socket(),    
            gameId: 0,      
            squares : squares,
            gamePieces: [{text:"D", color:"grey"}, {text:"", color:"grey"}, {text:"B", color:"grey"}, {text:"R", color:"grey"}],
            stepNumber: 0,
            roundNumber: 0,
            roundMoves: 0,
            maxMovesRound: 0,
            name: "name",
            password: "password",
            loggedIn: false,
            role: "",           // the role for this instance player i.e either Runaway or Chaser
            chaserName: "",     
            runawayName: "",    
            activePlayer: "",
            activeGamePiece: null,   // Which cell in gamepiece is active
            fromSquare: null,  // Which cell in gameboard moving from
            toSquare: null,  // Which cell in gameboard moving to
            rows: props.value.rows,
            columns: props.value.columns,        
            maxDetectives: 0,
            maxCCTV: 0,
            maxRoadBlocks: 0,
            maxRunners: 0,
        };

        this.updateServer = this.updateServer.bind(this);  
        this.updateFromServer = this.updateFromServer.bind(this)
        this.onGameOver = this.onGameOver.bind(this)
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);       
        this.handleChange = this.handleChange.bind(this);       
        this.handleClick = this.handleClick.bind(this);  
    }
    
    componentDidMount() {
        this.state.client.registerHandler(this.updateFromServer);
        this.state.client.registerGameOverHandler(this.onGameOver);
    }
    
    componentDidUpdate() {

    }
    
    componentWillUnmount() {
        this.state.client.unregisterHandler();
        this.state.client.registerGameOverHandler();
    }
   
    // Test if a node clicked on board can be moved from
    canMoveFromSquare(fromSquare, clickedSquare){
        if ( (fromSquare === null) && 
             (  ((this.state.activePlayer === "Chaser") && (this.state.squares[clickedSquare].occupiedBy === "D")) 
                || 
                ((this.state.activePlayer === "Runaway") && (this.state.squares[clickedSquare].occupiedBy === "R")) ) ){
            return true;
        }
        else {
            return false;
        }
    }
   // Test if a node clicked on board can be moved to
    canMoveToSquare(fromSquare, toSquare){
        if (fromSquare !== null){
            if (this.state.roundNumber !== 0) {
                if (((this.state.activePlayer === "Chaser" && this.state.squares[fromSquare].occupiedBy === "D") || 
                    (this.state.activePlayer === "Runaway" && this.state.squares[fromSquare].occupiedBy === "R")) 
                    && 
                    this.state.squares[fromSquare].roundMoves < 2 && isNeighbour(fromSquare, toSquare,this.state.columns )){
                    return true;
                }
            }
        }
        return false;
    }
    // Test and move a game piece out on gameboard
    moveGamePieceToBoard(activeGamePiece, gamePieces, toSquare, updatedSquares, updatedGamePieces) {
        let maxDetectives = this.state.maxDetectives;
        let maxCCTV = this.state.maxCCTV;
        let maxRoadBlocks = this.state.maxRoadBlocks;
        let maxRunners = this.state.maxRunners;   
 
        if ((activeGamePiece===0 && maxDetectives>0) ||  (activeGamePiece===1 && maxCCTV>0) ||  (activeGamePiece===2 && maxRoadBlocks>0) ||  (activeGamePiece===3 && maxRunners>0)){
            if (activeGamePiece !== 1){
                updatedSquares[toSquare].text = gamePieces[activeGamePiece].text;
                updatedSquares[toSquare].occupiedBy = gamePieces[activeGamePiece].text;
            }
            if (activeGamePiece===0){
                maxDetectives--;
                if (!maxDetectives){
                    updatedGamePieces[activeGamePiece].color = "grey";
                    updatedGamePieces[activeGamePiece].backgroundColor = "lightgrey";
                    activeGamePiece = null;
                }
            }
            if (activeGamePiece===1){
                if (!updatedSquares[toSquare].occupiedByCCTV){
                    maxCCTV--;
                    updatedSquares[toSquare].text = "";
                    updatedSquares[toSquare].backgroundColor = "yellow";
                    updatedSquares[toSquare].occupiedByCCTV = true;
                    if (!maxCCTV){
                        updatedGamePieces[activeGamePiece].color = "grey";
                        updatedGamePieces[activeGamePiece].backgroundColor = "lightgrey";
                        activeGamePiece = null;
                    }
                }
            }
            if (activeGamePiece===2){
                maxRoadBlocks--;
                if (!maxRoadBlocks){
                    updatedGamePieces[activeGamePiece].color = "grey";
                    updatedGamePieces[activeGamePiece].backgroundColor = "lightgrey";
                    activeGamePiece = null;
                }
            } 
            if (activeGamePiece===3){
                maxRunners--;
                if (!maxRunners){
                    updatedGamePieces[activeGamePiece].color = "grey";
                    updatedGamePieces[activeGamePiece].backgroundColor = "lightgrey";
                    activeGamePiece = null;
                }
            }                                                               
        }
        this.setState({
            maxDetectives: maxDetectives,
            maxCCTV: maxCCTV,
            maxRoadBlocks: maxRoadBlocks,        
            maxRunners: maxRunners,
            activeGamePiece: activeGamePiece,

          });
    }

    // A player has clicked "DONE" and server updates players with gameboard status
    updateFromServer(activePlayer, roundNumber, players, chaserSquares, runawaySquare) {
        /*  activePlayer is which role has the turn to move, i.e. "Chaser" or "Runaway"
            chaserSquares are the gamepieces out on gameboard Chaser has
            runawaySquares are the gamepieces out on gameboard Runaway has
        */   
        // clone state squares array to be able to set private attributes so the gameboard status can be updated 
        let info = "";
        const squares = this.state.squares.slice();
        let updatedSquares = [];
        cloneArray(updatedSquares, squares);
  
        for (var i = 0; i < this.state.rows * this.state.columns; i++) {
            // Initialize cloned squares
            updatedSquares[i].text ="";
            updatedSquares[i].occupiedBy = "";
            updatedSquares[i].color = "blue";
            updatedSquares[i].backgroundColor ="white";
            updatedSquares[i].roundMoves = 0;
        }
        if (chaserSquares !== null){
            for (let i=0;i<chaserSquares.length;i++){
                let squareIndex = chaserSquares[i][0];
                updatedSquares[squareIndex].text = chaserSquares[i][1].text;
                updatedSquares[squareIndex].occupiedBy = chaserSquares[i][1].occupiedBy;
                updatedSquares[squareIndex].color = chaserSquares[i][1].color;
                updatedSquares[squareIndex].occupiedByCCTV = chaserSquares[i][1].occupiedByCCTV;
                if (this.state.role === "Chaser" && chaserSquares[i][1].occupiedByCCTV) {
                    updatedSquares[squareIndex].backgroundColor = "yellow";
                }
            }
        }
        if (!isNullOrUndefined(runawaySquare)) {
            let squareIndex = runawaySquare[0];
            updatedSquares[squareIndex].text = runawaySquare[1].text;
            updatedSquares[squareIndex].occupiedBy = runawaySquare[1].occupiedBy;
            updatedSquares[squareIndex].color = runawaySquare[1].color;
            updatedSquares[squareIndex].backgroundColor = "white";
            if (this.state.role === "Chaser" && runawaySquare[1].occupiedByCCTV) {
                updatedSquares[squareIndex].backgroundColor = "yellow";
            }
        }
        let maxMovesRound = 0;    
        if (roundNumber !== 0) {
            // Chaser and Runaway have diffent number of total moves per round
            if (activePlayer === "Chaser"){
                maxMovesRound = 6;
            }
            else  if (activePlayer === "Runaway"){
                maxMovesRound = 2; 
                if (this.state.role === "Runaway" && (roundNumber === 2 || roundNumber === 5 || roundNumber === 8)){
                    info = "Your runner will be visible to chaser after you have done this move";
                }
            } 
        }        
        this.setState({
            infoFromServer: info,
            chaserName: players[0].name,
            runawayName: players[1].name,
            roundNumber: roundNumber,
            squares: updatedSquares,
            activePlayer: activePlayer,
            maxMovesRound: maxMovesRound,
            roundMoves: 0
        });        

    }

    onGameOver(winner) {
        // We have a winner, blank out gamebord and display the winner
        const squares = this.state.squares.slice();
        // clone state squares array to be able to set private attributes 
        let updatedSquares = [];
        cloneArray(updatedSquares, squares);
        for (var i = 0; i < this.state.rows * this.state.columns; i++) {
            updatedSquares[i].text ="";
            updatedSquares[i].occupiedBy = "";
            updatedSquares[i].occupiedByCCTV = false;
            updatedSquares[i].color = "blue";
            updatedSquares[i].backgroundColor ="white";
            updatedSquares[i].roundMoves = 0;
        }

        this.setState({
            winner: winner, 
            squares: updatedSquares
        });

    }


    updateServer(squaresToServer) {
        // update server with player gamepieces on gameboard
        this.state.client.playerMove(this.state.gameId, squaresToServer, (err, msg, squares) => {
            return (msg)
        });
    }


    handleDoneClick() {
        if (this.state.roundNumber === 0){
            if (!verifyAllStartPiecesMoved(this.state.role, this.state.maxDetectives, this.state.maxRunners)){
                this.setState({infoFromServer: "You must complete move out of all Detectives/Runner"});
                return;
            }
        }
        // Only send squares to server which are occupied by players gamepieces
        let squaresToServer = [];
        if (this.state.activePlayer === this.state.role) {
            for (let i=0; i< this.state.squares.length; i++) {
                if (this.state.squares[i].occupiedBy !== "" || this.state.squares[i].occupiedByCCTV){
                    squaresToServer.push([i, this.state.squares[i]]);
                }
            }
            // Send squares to server
            this.updateServer(squaresToServer);
        }
    }

    handleSideInfoClick(activeGamePiece) {
        // A GamePiece from the sideino is clicked
        if (this.state.activePlayer !== this.state.role) {
            return;
         }        

         // clone state gamePieces array to be able to set private attributes         
         const gamePieces = this.state.gamePieces.slice();  
        let updatedGamePieces = [];
        cloneArray(updatedGamePieces, gamePieces);        
      
        // clone state squares array to be able to set private attributes  
        const squares = this.state.squares.slice();
        let updatedSquares = [];
        cloneArray(updatedSquares, squares); 
        
        let fromSquare = this.state.fromSquare;

        if ((activeGamePiece===0 && this.state.maxDetectives>0) ||  
            (activeGamePiece===1 && this.state.maxCCTV>0) ||  
            (activeGamePiece===2 && this.state.maxRoadBlocks>0) || 
            (activeGamePiece===3 && this.state.maxRunners>0)){

            if (this.state.fromSquare !== null)
            {
                updatedSquares[fromSquare].color = "blue";
                fromSquare = null;
            }

            for (let index=0;index<gamePieces.length;index++)
            {
                if (gamePieces[index].color !== "grey"){
                    updatedGamePieces[index].color = "blue";
                    updatedGamePieces[index].backgroundColor = "chartreuse";
                }
                if (activeGamePiece===index){
                    if (gamePieces[index].color === "red"){
                        updatedGamePieces[index].color = "blue";
                        updatedGamePieces[index].backgroundColor = "chartreuse";
                    }
                    else{
                        updatedGamePieces[index].color = "red";
                        updatedGamePieces[index].backgroundColor = "chartreuse";
                    }
                }
            }
            this.setState({
                gamePieces: updatedGamePieces,
                squares:    updatedSquares,
                activeGamePiece: activeGamePiece,
                fromSquare: fromSquare
            });        
        }      
    }

    handleBoardClick(i) {
        // A node in the gameboard i clicked. Either trying to move square from this node or square/gamepiece to this node
        if (this.state.activePlayer !== this.state.role) {
            return;
        }   
        // clone state gamePieces array to be able to set private attributes  
        const gamePieces = this.state.gamePieces.slice();  
        let updatedGamePieces = [];
        cloneArray(updatedGamePieces, gamePieces);
    
         // clone state sqyuares array to be able to set private attributes  
        const squares = this.state.squares.slice();      
        let updatedSquares = [];
        cloneArray(updatedSquares, squares);

        let activeGamePiece = this.state.activeGamePiece;
        let fromSquare = this.state.fromSquare;
        let toSquare = this.state.toSquare;
        let roundMoves =  this.state.roundMoves;
        if (this.state.roundNumber !== 0 &&  this.state.roundMoves === this.state.maxMovesRound && activeGamePiece !== 1 && activeGamePiece !== 2){
            // Inform max moves this round made
            this.setState({infoFromServer: "All moves this round are made, click DONE"});
            return;
        }
        
        if (squares[i].occupiedBy === "") {   
            // empty square clicked, probably attempt to move to, otherwise it will fail
            toSquare = i;
            updatedSquares[toSquare].color = "blue";
            
            if (activeGamePiece !== null) {
                this.moveGamePieceToBoard(activeGamePiece, gamePieces, toSquare, updatedSquares, updatedGamePieces);
                if (fromSquare !== null){
                    updatedSquares[fromSquare].text = "";
                    updatedSquares[fromSquare].occupiedBy = "";
                    fromSquare = null;
                }
            }
            else if (this.canMoveToSquare(fromSquare, toSquare)){
                updatedSquares[toSquare].text = squares[fromSquare].text;
                updatedSquares[toSquare].occupiedBy = squares[fromSquare].occupiedBy;
                updatedSquares[toSquare].roundMoves = squares[fromSquare].roundMoves +1;
                updatedSquares[fromSquare].text = "";
                updatedSquares[fromSquare].occupiedBy = "";
                updatedSquares[fromSquare].roundMoves = 0;
                fromSquare = null;
                roundMoves++;
            }
        }
        else if  (this.canMoveFromSquare(fromSquare, i)){
            fromSquare = i;
            if (activeGamePiece !==null && updatedGamePieces[activeGamePiece].color !== "grey")
                updatedGamePieces[activeGamePiece].color = "blue";
            activeGamePiece = null;
            toSquare = null;     
            updatedSquares[i].color = "red";   
        }
        else if (fromSquare === i){
            // Tried to move to same square as starting from
            fromSquare = null;
            updatedSquares[i].color = "blue"; 
        }
        else if ((this.state.role === "Chaser") && isWinner(squares[fromSquare], squares[i])){
            this.state.client.emitGameOver(this.state.gameId);
        }
        this.setState({
            squares: updatedSquares,
            gamePieces: updatedGamePieces,
            roundMoves: roundMoves,
            activeGamePiece: activeGamePiece,
            fromSquare: fromSquare,
            toSquare: toSquare,
        });
    }
  
    handleRegister() {
        this.state.client.emitRegister(this.state.name, this.state.password, (err, userName) => {
            if (err) {
                this.setState({infoFromServer: err.message});
            } else {
                this.setState({
                    infoFromServer: "Register succeeded, logged in",
                    loggedIn: true
                });
            }
            this.setState({password: ""}); 
            return (userName);
        });
    }
    handleLogin() {
        this.state.client.emitLogin(this.state.name, this.state.password, (err, userName) => {
            if (err) {
                this.setState({infoFromServer: err.message});
            } else {
                this.setState({
                    infoFromServer: "logged in",
                    loggedIn: true
                });
            }            
            this.setState({password: ""}); 
            return (userName)
        })
    }
    handleStartGame() {
        // Get game setup parameters from server in callback
        this.state.client.emitPlay(this.state.name, (err, gameId, setup) => {
            if (err) {
                this.setState({infoFromServer: err.message});
            } else {
                let chaser = "";
                let runaway = "";
                if (setup.role === "Chaser")
                    chaser = this.state.name;
                else
                    runaway = this.state.name;

                let maxMovesRound = 0;    
                let maxDetectives = setup.maxDetectives;
                let maxCCTV = setup.maxCCTV;
                let maxRoadBlocks = setup.maxRoadBlocks;       
                let maxRunners = setup.maxRunners;

                if (chaser === this.state.name){
                    maxRunners = 0;
                }
                if (runaway === this.state.name){
                    maxDetectives = 0;
                    maxRoadBlocks = 0;
                    maxCCTV = 0;
                }

                let cctvColor = "blue";
                let detectiveColor = "blue";
                let roadblockColor = "blue";  
                let runnerColor = "blue";  
                let cctvBackgroundColor = "chartreuse";
                let detectiveBackgroundColor = "chartreuse";
                let roadblockBackgroundColor = "chartreuse";
                let runnerBackgroundColor = "chartreuse";
                if (!maxCCTV){
                    cctvColor = "grey";
                    cctvBackgroundColor = "lightgrey";
                }
                if (!maxDetectives){
                    detectiveColor = "grey";
                    detectiveBackgroundColor = "lightgrey";
                }        
                if (!maxRoadBlocks){
                    roadblockColor = "grey";
                    roadblockBackgroundColor = "lightgrey";
                }        
                if (!maxRunners){
                    runnerColor = "grey";
                    runnerBackgroundColor = "lightgrey";
                }        

                this.setState({
                    infoFromServer: "Wait for other player",
                    gameId: setup.gameId,
                    gamePieces: [{text:"D",color:detectiveColor,backgroundColor:detectiveBackgroundColor}, {text:"C",color:cctvColor, backgroundColor:cctvBackgroundColor}, {text:"B",color:roadblockColor,backgroundColor:roadblockBackgroundColor}, {text:"R",color:runnerColor, backgroundColor:runnerBackgroundColor}],
                    maxMovesRound:  maxMovesRound,
                    role:           setup.role,
                    chaserName:     chaser,
                    runawayName:    runaway,
                    winner:         "",
                    maxDetectives:  maxDetectives,
                    maxCCTV:        maxCCTV,
                    maxRoadBlocks:  maxRoadBlocks,        
                    maxRunners:     maxRunners,       
                });
            }
            return (gameId, setup);
        });
        
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    handleClick({ target }) {
        this.setState({
            [target.name]: ""
        });
      }

    render() {
        const gamePieces = this.state.gamePieces;
        const squares = this.state.squares;
        let doneStyle = {color:"grey",backgroundColor:"lightgrey"}
        let chaserStyle = {color:"lightgrey",backgroundColor:"grey",font:"normal"}
        let runnerStyle = {color:"lightgrey",backgroundColor:"grey",font:"normal"}
        let loginClass = "login-show";
        let startGameClass = "startGame-hide";
        let gamePiecesClass = "gamePieces-show";
        let runningGameClass = "runningGame-hide";       
        let winnerClass = "noWinner";
        let infoFromServerClass = "info-hide";
        let roundClass  = "round-show";
        if (this.state.loggedIn){
            startGameClass = "startGame-show"
            loginClass = "login-hide";
        }
        if (this.state.infoFromServer !== ""){
            infoFromServerClass = "info-show";
        } 
        if (this.state.activePlayer !== this.state.role){
            roundClass  = "round-hide";
        }        
        if (this.state.role !== ""){
            loginClass = "login-hide";
            startGameClass = "startGame-hide";
            gamePiecesClass = "gamePieces-show";
            runningGameClass = "runningGame-show";
        }
        if (this.state.winner !== ""){
            winnerClass = "isWinner";
            startGameClass = "startGameClass-show";
            gamePiecesClass = "gamePieces-hide";
            roundClass = "round-hide";
            doneStyle = {display: "none"}
        }
        
        if (this.state.activePlayer === "Chaser")
            chaserStyle =  {color:"black",backgroundColor:"lightgreen",font:"bold"};

        if (this.state.activePlayer === "Runaway")
            runnerStyle = {color:"black",backgroundColor:"lightgreen",font:"bold"};
            
        if (this.state.activePlayer === this.state.role && this.state.winner === "") {
            doneStyle = {color:"green",backgroundColor:"lightgreen"}
        }

        return (
            <div className="game">


                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={i => this.handleBoardClick(i)}
                    />
                </div>
                                   
                <div className="game-info">
                    <div className={loginClass}>
                    <input type="text" name="name" value={this.state.name}  onClick={ this.handleClick } onChange={ this.handleChange } />
                        <input type="password" name="password"  value={this.state.password} onClick={ this.handleClick } onChange={ this.handleChange } />
                        <br/>
                        <button onClick={this.handleRegister}>Register</button>
                        <button onClick={this.handleLogin}>Login</button>
                        <Rules className="rules"/> 
                    </div>  
                    <div className={infoFromServerClass}>
                        {this.state.infoFromServer}
                    </div>                       
                    <div className={startGameClass}>
                        <button onClick={this.handleStartGame}>Start new game</button>
                    </div>
                    <br/>   
                    <div className={runningGameClass}>                 
                        <div >
                            <Player 
                                playerRole= "Chaser"
                                name={this.state.chaserName}
                                style={chaserStyle}
                            />
                            <Player 
                                playerRole= "Runaway"                
                                name={this.state.runawayName}
                                style={runnerStyle}
                            />  
                            <br/>                           
                            <div className="status-board">
                                <div className={winnerClass}>
                                    <label>Winner:</label>
                                    {this.state.winner}
                                </div>
                                <br/>
                                <label>Roundnumber: </label>
                                {this.state.roundNumber}
                            </div>
                            <div className={roundClass}>
                                <br/>
                                Moves this round: {this.state.roundMoves} / {this.state.maxMovesRound}
                            </div>              
                        </div>
                        <div className={gamePiecesClass}>
                            <GamePieces
                                gamePieces={gamePieces}
                                onClick={i => this.handleSideInfoClick(i)}
                            />
                        </div>  
                        <div className="done-div">
                            <Done
                                style = {doneStyle}
                                onClick={() => this.handleDoneClick()}
                            />
                            <Rules className="rules"/>  
                        </div>  
                    </div>  
            </div>
        </div>
      );
    }
}

function cloneArray(target, source){
for (let index=0;index<source.length;index++)
    {        
        target[index] = Object.assign({}, source[index]);
    }       
}

function isSameRow(a,b,columns){
    let divA = Math.trunc(a/columns);
    let divB = Math.trunc(b/columns);
    return divA === divB;
}

function isSameColumn(a,b,columns){
    let modA = a%columns;
    let modB = b%columns;
    return modA === modB;
}

function isNeighbour(a,b, columns){

    if (isSameRow(a,b, columns)){
        if ((a+1===b) || (a-1===b))
            return true;
    }
    if (isSameColumn(a,b,columns)){
        if ((a+columns===b) || (a-columns===b))
            return true;
    }
    return false;
}

function verifyAllStartPiecesMoved(role, maxDetectives, maxRunners){
    if (role === "Chaser"){
        return (maxDetectives === 0);
    }
    else if (role === "Runaway"){
        return (maxRunners === 0);
    }
}

function isWinner(fromSquare, toSquare){
    if((fromSquare !== undefined) && (toSquare !== undefined) && (fromSquare.occupiedBy === "D") && (toSquare.occupiedBy === "R")) {
        return true; 
    } else {
        return false;
    }
}    


