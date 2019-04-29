import { isArray } from "@xcmats/js-toolbox"
import { config } from "../../config"



export default (currency, fnModule) => {

    const STATUS = {
        connecting: 0,
        opened:     1,
        online:     2,
        subscribed: 3,
        closed:     4,
    }

    fnModule.setSocket({
        status: STATUS.connecting,
    })

    const socket = new WebSocket(config.krakenSocket)


    socket.onmessage = function (event) {
        const data = JSON.parse(event.data)
        if (
            isArray(data) &&
            data[1] === "ticker" &&
            data[2] === `XLM/${currency.toUpperCase()}`
        ) {
            fnModule.updateExchangeRate(currency, data[3].a[0])
        } else if (data.status) {
            fnModule.setSocket({
                status: STATUS[data.status],
            })
        }
    }

    socket.onopen = function (_event) {
        fnModule.setSocket({
            status: STATUS.opened,
        })
        socket.send(JSON.stringify({
            "event": "subscribe",
            "pair": [`XLM/${currency.toUpperCase()}`],
            "subscription": { "name": "ticker" },
        }))

    }

    socket.onclose = function (_event) {
        fnModule.setSocket({
            status: STATUS.closed,
        })
    }

    return socket
}
