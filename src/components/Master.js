import {useEffect,useState} from "react"
import "./css/Master.css";
import Table from './Table'
import io from "socket.io-client";

const Master = (props) => {
    const socket2 = io.connect("http://"+props.config.ip_address+":3002");
    const [inputOut, setInputOut] = useState({empty:''});
    const [Table_data, setTable_Data] = useState({col:[{name:'empty'}],val:[{empty:''}]});
    const [nilai,setNilai] = useState(0);
    const [berat,setBerat] = useState(0);
       

    
    function TriggerRender(){
        var cnt = 0;
        cnt=nilai+1;
        setNilai(cnt);
    }
    function HandleChange(event){
        let input1=inputOut
        TriggerRender();
        input1[event.target.name]=event.target.value;
        setInputOut(input1);
    }
    function HandleTambah(e){        
        let input1=inputOut;
        TriggerRender();
        Table_data.col.forEach(colname=>{            
            input1[colname.name]=''
        });        
        
       setInputOut(input1);
    }
    function HandleClick(e){
        const dat=e.target.getAttribute('item')
        let input1=inputOut;
        TriggerRender();
        Table_data.col.forEach(colname=>{            
            if (Table_data.val[dat][colname.name]===null){
                input1[colname.name]='';
            }else{
                input1[colname.name]=Table_data.val[dat][colname.name]
            }
            
        });        
        
       setInputOut(input1);
    }
    const generateData = () =>{
         fetch('http://localhost:3001/exec/'+'select * from '+props.tablename)
        .then(response => response.json())
        .then(data => {setTable_Data(data);console.log(data)});
    }


    useEffect(()=>{
        // props.socket.on("result", (data)=>{
        //     setTable_Data(data) 
        socket2.on("result", (data)=>{
        setBerat(data) ;
        console.log(data);
    })    
    return () => {
        // props.socket.off('result');
        socket2.off('result');
      };
    });
    
    const deleteData = () => {
        var updateVal='';
        var querycol='';
        Table_data.col.forEach(col => {
            
            if (col.name.includes('_id')===true){
                if (inputOut[col.name]!=='' && inputOut[col.name]!==undefined){
                    updateVal=' where '+col.name+'='+inputOut[col.name]
                }
            }
            
            
        })
        if (updateVal!==''){
            querycol='delete from '+props.tablename+' '+updateVal;
            fetch('http://localhost:3001/insert/'+querycol+'/select * from '+props.tablename)
        .then(response => response.json())
        .then(data => {setTable_Data(data);console.log(data)});
            // props.socket.emit('insert',{insert:querycol,select:'select * from '+props.tablename})
            // console.log(querycol)
        }
        
        
    }

    const addData = () => {
        // console.log(Table_data);
        var querycol='';
        var queryval='';
        var updateVal='';
        console.log(inputOut)
        Table_data.col.forEach(col => {
            
            if (col.name.includes('_id')===true){
                if (inputOut[col.name]!=='' && inputOut[col.name]!==undefined){
                    updateVal=' where '+col.name+'='+inputOut[col.name]
                }
            }
            if (updateVal!==''){
                if (col.name.includes('_id')===false){
                    if (querycol!==''){
                        querycol+=","
                    }

                    querycol+=col.name+"='"+inputOut[col.name]+"'"
                }
            }else{
                if (col.name.includes('_id')===false){
                    if (querycol!==''){
                        querycol+=','
                        queryval+=','
                    }
                    querycol+=col.name
                    queryval+="'"+inputOut[col.name]+"'"
                }
            }
            
            
        })
        if (updateVal!==''){
            querycol='update '+props.tablename+' set '+querycol+updateVal;
        }else{
            querycol='insert into '+props.tablename+' ('+querycol+') values ('+queryval+')';
        }
        
        // props.socket.emit('insert',{insert:querycol,select:'select * from '+props.tablename})
        fetch('http://localhost:3001/insert/'+querycol+'/select * from '+props.tablename)
        .then(response => response.json())
        .then(data => {setTable_Data(data);console.log(data)});
    };

      
      const data=Table_data;

      if (data.col[0].name==='empty'){
        generateData();
      }
     
 

    return(
        <div className="container">
            
            <div className="inputform">               
                {
                    Table_data.col.map((col=>(
                    <div><div>{col.name.toUpperCase().replace("_"," ")}</div>
                    <input name={col.name} value={inputOut[col.name]} onChange={HandleChange}/>
                    </div>
                    
                    
                )))
                }
                <button className="button" onClick={addData}>
                    <span>SAVE</span>
                </button>
                <button className="button" onClick={deleteData}>
                    <span>DELETE</span>
                </button>
                <div>{berat}</div>
                
            </div>
            <div className="tableform">
                <Table Table_data={Table_data} HandleClick={HandleClick} />
                
                <button className="button" onClick={HandleTambah}>
                    <span>ADD NEW</span>
                </button>
            </div>
        </div>
    )
}
 
export default Master;