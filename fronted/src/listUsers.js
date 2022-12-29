import { Button } from "rsuite";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";

function ListUsers(props) {
    const navigate = useNavigate();

    // btn click user name
    const btnClickUserName = (e) => {
        axios.get("/userName/" + e.target.value.split(",")[1]).then((res) => {
            // save id and user
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: res.data[1],
                    name: res.data[2],
                    location: res.data[3],
                    created_at: res.data[4],
                    description: res.data[5],
                    profile_image_url: res.data[6],
                    public_metrics: res.data[7],
                    url: res.data[8],
                    verified: res.data[9],
                })
            );

            // redirect to /graphsSentiments
            navigate({
                pathname: "/graphsSentiments",
                search: `?${createSearchParams({
                    id: e.target.value.split(",")[0].toString(),
                    name: e.target.value.split(",")[1],
                })}`,
            });
        });
    };

    const listUsers = props.listUsers.map((item) => (
        <Button key={item["id"]} color="cyan" appearance="primary" value={[item["id"], item["name"]]} onClick={btnClickUserName}>
            {item["name"]}
        </Button>
    ));

    return <div className="div-btn-users">{listUsers}</div>;
}

export default ListUsers;
