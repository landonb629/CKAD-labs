import React, { useState } from "react";
import axios from 'axios';


const Call = () => { 
    const [data, setData] = useState('')
    const handleGet = async () => { 
        const request = await axios.get('http://10.11.0.20:3030/api/v1/user')
        const {msg} = request.data
        setData(msg);
    }
    return(
        <div>
            <h2>{data}</h2>
            <button type='button' onClick={handleGet}>get request</button>
        </div>
    )
}

export default Call