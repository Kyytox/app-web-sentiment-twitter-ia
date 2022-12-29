import React from "react";
import { Text } from "@visx/text";
import { Wordcloud } from "@visx/wordcloud";

function WordCloudGraph(props) {
    // create array dict
    const data = props.ListFrequentsWords;
    const colors = ["#FF5C5C", "#FF0A0A", "#B80000", "#7A0000", "#3D0000"];

    return (
        <div className="wordcloud">
            <Wordcloud
                words={data}
                width={600}
                height={500}
                font={"Franklin Gothic Medium"}
                padding={2}
                fontSize={function (datum) {
                    return Math.sqrt(datum.value) * 2.5;
                }}
                rotate={0}
                spiral={"archimedean"}
            >
                {(cloudWords) =>
                    cloudWords.map((w, i) => (
                        <Text key={w.text} fill={colors[i % colors.length]} textAnchor={"middle"} transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`} fontSize={w.size} fontFamily={w.font}>
                            {w.text}
                        </Text>
                    ))
                }
            </Wordcloud>
        </div>
    );
}

export default WordCloudGraph;
