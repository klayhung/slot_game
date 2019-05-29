module.exports = {
    sock: null,
    onOpenCB: null,
    onMessageCB: null,

    /**
     * 連線成功
     * @param {JSON} event
     */
    on_open(event) {
        console.log(`client connected: ${JSON.stringify(event)}`);
        this.onOpenCB(event.data);
    },

    /**
     * 收訊息
     * @param {JSON} event
     */
    on_message(event) {
        console.log(`client receive data: ${event.data}`);
        this.onMessageCB(event.data);
    },

    /**
     * 關閉連線
     */
    on_close() {
        this.close();
    },

    /**
     * 錯誤處理
     */
    on_error() {
        this.close();
    },

    /**
     * 關閉連線
     */
    close() {
        if (this.sock) {
            this.sock.close();
            this.sock = null;
        }
    },

    /**
     * 連線 Server
     * @param {String} url IP:Post
     * @param {Function} openCB CallBack
     * @param {Function} messageCB CallBack
     */
    connect(url, openCB, messageCB) {
        this.sock = new WebSocket(url);
        this.sock.binaryType = 'arraybuffer';
        this.sock.onopen = this.on_open.bind(this);
        this.sock.onmessage = this.on_message.bind(this);
        this.sock.onclose = this.on_close.bind(this);
        this.sock.onerror = this.on_error.bind(this);
        this.onOpenCB = openCB;
        this.onMessageCB = messageCB;
    },

    /**
     * 送訊息
     * @param {String} data 資料
     */
    send_data(data) {
        this.sock.send(data);
    },
};

// module.exports.websocket = websocket;
// exports.wsocket = wsocket;
