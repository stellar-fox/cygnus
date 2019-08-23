import React, { Component } from "react"
import { connect } from "react-redux"
import {
    area,
    axisBottom,
    axisLeft,
    extent,
    format,
    max,
    min,
    scaleLinear,
    scaleTime,
    select,
    timeFormat,
} from "d3"
import BigNumber from "bignumber.js"


const today = new Date()


/**
 * `<AreaLine>` component.
 *
 * @function AreaLine
 * @returns {React.ReactElement}
 */
class AreaLine extends Component {

    state = {
        data: [],
    }

    componentDidMount () {
        this.setState({
            data: this.props.data.map(
                (el, idx) => ({
                    date: new Date(
                        new Date().setDate(
                            today.getDate() - (this.props.data.length - 1 - idx)
                        )
                    ),
                    value: el,
                })),
        }, () => {
            this.drawChart()
        })
    }

    drawChart () {

        const margin = ({top: 20, right: 20, bottom: 30, left: 50})

        const x = scaleTime()
            .domain(extent(this.state.data, d => d.date))
            .range([margin.left, this.props.width - margin.right])

        const y = scaleLinear()
            .domain([
                min(this.state.data, d => d.value),
                max(this.state.data, d => d.value),
            ])
            .nice()
            .range([this.props.height - margin.bottom, margin.top])

        const xAxis = g => g
            .attr(
                "transform",
                `translate(0,${this.props.height - margin.bottom})`
            )
            .call(
                axisBottom(x)
                    .ticks(this.props.width / 80)
                    .tickSizeOuter(0)
                    .tickFormat(timeFormat("%m/%d"))
            )

        const yAxis = g => g
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(axisLeft(y)
                .ticks(5)
                .tickFormat(format(",.3f")))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(`${
                    this.props.baseSymbol
                }/${
                    this.props.coinSymbol
                } | ATH: ${
                    this.props.baseSign
                } ${
                    new BigNumber(this.props.athPrice).toFixed(2)
                }  | ${
                    this.props.change
                }% THIS MONTH`)
            )

        const areaUnderCurve = area()
            .x(d => x(d.date))
            .y0(y(y.domain()[0]))
            .y1(d => y(d.value))

        let svg = select(`#${this.props.id}`)
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .style("margin-left", 100)

        let defs = svg.append("defs")

        let gradient = defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%")

        gradient.append("stop")
            .attr("class", "start")
            .attr("offset", "0%")
            .attr("stop-color", "rgb(246, 190, 49)")
            .attr("stop-opacity", 0.7)

        gradient.append("stop")
            .attr("class", "end")
            .attr("offset", "100%")
            .attr("stop-color", "rgb(250,219,142)")
            .attr("stop-opacity", 1)

        svg.append("path")
            .datum(this.state.data)
            .attr("stroke", "url(#svgGradient)")
            .attr("fill", "url(#svgGradient)")
            .attr("d", areaUnderCurve)

        svg.append("g")
            .attr("class", "axis")
            .call(xAxis)

        svg.append("g")
            .attr("class", "axis")
            .call(yAxis)
    }

    render (){
        return <svg id={this.props.id}></svg>
    }
}




// ...
export default connect(
    (state) => ({
        athDate: state.ExchangeRates.coinData.coin.allTimeHigh.timestamp || "",
        athPrice: state.ExchangeRates.coinData.coin.allTimeHigh.price || "",
        baseSign: state.ExchangeRates.coinData.base.sign || "",
        baseSymbol: state.ExchangeRates.coinData.base.symbol || "",
        change: state.ExchangeRates.coinData.coin.change || "",
        coinSymbol: state.ExchangeRates.coinData.coin.symbol || "",
    })
)(AreaLine)
