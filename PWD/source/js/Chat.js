/**
 * Chat window
 *
 * @author Johan Söderlund
 * @version 1.0
 */

const genericAppWindow = require('./genericAppWindow.js');
const webStorage = require("./webStorage");
class Chat {

    /**
     * Constructs an object of Chat.
     *
     * @param {string} userName - The nickname of the user.
     */
    constructor(userName) {
        this._incomingMessage = document.querySelector('#incoming-message');
        this._socketConfig = {
            type: "message",
            data: "",
            username: userName,
            channel: "Channel1",
            key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }
        this._myInstance = genericAppWindow.appWindow("Chat");
        this.setupChat();
        this.setupSelect();
        this._socket = this.createSocket("ws://vhost3.lnu.se:20080/socket/");
    }

    /**
     * Instantiates the appboard.
     */
    setupChat(){
        let chatApplication = document.getElementById("app-chat");
        let appBoard = this._myInstance.querySelector(".app-board");
        let clone = document.importNode(chatApplication.content, true);
        appBoard.appendChild(clone);
        appBoard.addEventListener("click", this.LMB.bind(this));
        appBoard.addEventListener("keyup", this.keyUp.bind(this));
    }

    /**
     * Triggered when LFM is pressed.
     *
     * @param {event} event - the left mouse button down event
     */
    LMB(event) {
        if (event.which === 1 && event.target.nodeName === "INPUT") {
            event.currentTarget.parentNode.style.zIndex = genericAppWindow.getNextZ();
            event.target.value = "";
        }
    }
    /**
     * Triggered when a key is released.
     * Sends the typed message, username and other config information to server
     *
     * @param {event} event - key event, (enter)
     */
    keyUp(event){
        if (event.keyCode === 13 && event.target.nodeName === "TEXTAREA") {
            let inputText = event.target.value;
            this._socketConfig.data = inputText;
            this._socket.send(JSON.stringify(this._socketConfig));
            event.target.value = "";
        }
    }
    /**
     * Creates a websocket to handle chat traffic, smoother protocol
     *
     * @param {String} url - the url to pass on data traffic
     */
    createSocket(url) {
        let socket = new WebSocket(url, 'charcords');
        socket.addEventListener('open', function (event) {
        });
        socket.addEventListener('message', this.recieve.bind(this));
        return socket;
    }
    /**
     * Recieves the server message, sent, recieved and pulses
     *
     * @param {event} event - server message
     */
    recieve(event) {
        let message = JSON.parse(event.data);
        if (message.type === 'message') {
            let messageFeed = this._myInstance.querySelector(".message-feed");
            let clone = document.importNode(this._incomingMessage.content, true);
            messageFeed.appendChild(clone);

            let date = new Date();
            let headLine = message.username + "   " + date.getFullYear() + "-" + (date.getMonth() + 1)
                + "-" + date.getDate() + "   " + date.getHours() + ":" + date.getMinutes();
            let storeMessage = {
                headLine: headLine,
                date: new Date(),
                username: message.username,
                data: message.data
            }
            messageFeed.getElementsByTagName("p")[(messageFeed.getElementsByTagName("p").length - 1)].textContent = headLine;
            messageFeed.getElementsByTagName("textarea")[(messageFeed.getElementsByTagName("textarea").length - 1)].textContent = message.data;
            messageFeed.scrollTop = messageFeed.scrollHeight;
            webStorage.addMessage(storeMessage, webStorage.getLog());
        }
    }
    //close
    closeSocket(){
        this._socket.close();
    }
    /**
     * Handles selected item in drop down menu
     *
     * @param {event} event - drop down menu item choosen
     */
    chatReconfig(event){
        let messageFeed = this._myInstance.querySelectorAll(".message-feed")[0];
        if (event.target.options[event.target.selectedIndex].value === "clear") {
            messageFeed.innerHTML = "";
        } else if (event.target.options[event.target.selectedIndex].value === "get last messages") {
            messageFeed.innerHTML = "";
            let messageLog = webStorage.getLog();
            for (let i = 0; i < messageLog.length; i += 1) {
                let clone = document.importNode(this._incomingMessage.content, true);
                messageFeed.appendChild(clone);
                messageFeed.getElementsByTagName("p")[(messageFeed.getElementsByTagName("p").length - 1)].textContent = messageLog[i].headLine;
                messageFeed.getElementsByTagName("textarea")[(messageFeed.getElementsByTagName("textarea").length - 1)].textContent = messageLog[i].data;
                messageFeed.scrollTop = messageFeed.scrollHeight;
            }
        } else if (event.target.options[event.target.selectedIndex].value === "select new nick") {
            document.querySelector("#login-container").classList.add("show");
        }
    }
    /**
     * Setup drop down menu
     */
    setupSelect() {
        let select = this._myInstance.getElementsByTagName("select")[0];
        let template = document.querySelector('#options');
        let clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option1 = select.getElementsByTagName("option")[0];
        option1.value = option1.textContent = "clear";

        clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option2 = select.getElementsByTagName("option")[1];
        option2.value = option2.textContent = "get last messages";

        clone = document.importNode(template.content, true);
        select.appendChild(clone);
        let option3 = select.getElementsByTagName("option")[2];
        option3.value = option3.textContent = "select new nick";

        select.options[0].selected = true;
        select.addEventListener("change", this.chatReconfig.bind(this));
    }
}

/**
 *  Exports.
 */
module.exports = Chat;
