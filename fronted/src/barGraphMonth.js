import React from "react";
import { ResponsiveBar } from "@nivo/bar";

function BarMonthGraph(props) {
    // create array dict
    const data = props.listNbTweetsMonth;

    // define width of chart width number of month
    const width_chart = data.length * 150 >= 900 ? 870 : data.length * 150;

    const MyResponsiveBar = (data) => (
        <ResponsiveBar
            width={width_chart}
            data={data}
            keys={["Negative", "Neutral", "Positive"]}
            indexBy={"date"}
            ariaLabel="Nivo bar chart demo"
            margin={{ top: 50, bottom: 50, left: 40 }}
            padding={0.3}
            borderRadius={2}
            valueScale={{ type: "linear" }}
            colors={["red", "yellow", "green"]}
            animate={true}
            motionStiffness={90}
            motionDamping={50}
            motionConfig="molasses"
            labelTextColor="white"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -50,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                tickColor: "red",
                legend: "Number of tweets",
                legendPosition: "middle",
                legendOffset: -35,
            }}
            theme={{
                fontSize: "14px",
                axis: {
                    tickColor: "White",
                    ticks: {
                        line: {
                            stroke: "grey",
                        },
                        // text in axis
                        text: {
                            fill: "white",
                        },
                    },
                    // title of axis
                    legend: {
                        text: {
                            fill: "grey",
                        },
                    },
                },
            }}
            // tooltip when we hover a graph
            tooltip={({ id, value }) => (
                <div
                    style={{
                        padding: 12,
                        color: "white",
                        background: "#222222",
                        borderRadius: 3,
                    }}
                >
                    <span>{id} tweets: </span>
                    <br />
                    <strong>{value}</strong>
                </div>
            )}
            // define gradiant
            defs={props.defsCharts}
            // defining rules to apply those gradients
            fill={[
                // match using object query
                { match: { id: "Negative" }, id: "gradientNega" },
                { match: { id: "Neutral" }, id: "gradientNeut" },
                { match: { id: "Positive" }, id: "gradientPosi" },
            ]}
        />
    );
    return (
        <div className="bar-month-charts">
            <h4>Number of tweets per sentiment by month </h4>
            {MyResponsiveBar(data)}
        </div>
    );
}

export default BarMonthGraph;
