import React from "react";
import { ResponsivePie } from "@nivo/pie";

function PieGraph(props) {
    // const data = props.listNbTweetsSentiment;
    const data = props.listNbTweetsSentiment;
    const totalTweets = data.reduce(function (total, value) {
        return total + value.value;
    }, 0);

    const MyResponsivePie = (data) => (
        <ResponsivePie
            data={data}
            margin={{ top: 100, right: 20, bottom: 20, left: 20 }}
            padAngle={2}
            innerRadius={0.02}
            cornerRadius={3}
            colors={["rgb(200, 2, 20)", "yellow", "rgb(0, 130, 31)"]}
            arcLabel={(data) => `${((data.value / totalTweets) * 100).toFixed(1)}%`}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
            arcLinkLabelsThickness={4}
            arcLinkLabelsStraightLength={25}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={"white"}
            activeOuterRadiusOffset={10}
            arcLabelsRadiusOffset={0.6}
            animate={true}
            motionConfig="molasses"
            transitionMode="innerRadius"
            theme={{ fontSize: 15 }}
            tooltip={({ datum: { id, value } }) => (
                <div
                    style={{
                        padding: 12,
                        color: "white",
                        background: "#222222",
                        borderRadius: 3,
                    }}
                >
                    <span>Number of tweets {id}: </span>
                    <br />
                    <strong>{value}</strong>
                </div>
            )}
            defs={props.defsCharts}
            // 2. defining rules to apply those gradients
            fill={[
                // match using object query
                { match: { id: "Negative" }, id: "gradientNega" },
                { match: { id: "Neutral" }, id: "gradientNeut" },
                { match: { id: "Positive" }, id: "gradientPosi" },
            ]}
        />
    );

    return (
        <div className="pie-charts">
            <h4>Breakdown of tweets by sentiment</h4>
            {MyResponsivePie(data)}
        </div>
    );
}

export default PieGraph;
