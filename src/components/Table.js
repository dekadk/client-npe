const Table = (props) => {
    
    return ( <table>
        <thead>
        <tr>
        {props.Table_data.col.map((col=>(
            (col.name.includes('_id')===false) && <th>{col.name.toUpperCase()}</th>
        )))}
        </tr>
        </thead>
        <tbody>
        {props.Table_data.val.map((val=>(
            <tr onClick={props.HandleClick}>
            {props.Table_data.col.map((col=>(
                (col.name.includes('_id')===false) && <td item={props.Table_data.val.indexOf(val)}>{val[col.name]}</td>
            )))}</tr>
            
        )))}
        </tbody>
        </table> );
}
 
export default Table;