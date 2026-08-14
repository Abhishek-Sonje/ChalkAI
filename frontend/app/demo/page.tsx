import { useState } from "react"
import axios from "axios"
export default async function Demo()
{
    const [getdata,setgetdata] = useState("");
    const Req= await axios.get("https://localhost:3000/")
    .then(()=>{
        setgetdata(Req.data)
    })
    return <div>
        <div>{}</div>
    </div>
}