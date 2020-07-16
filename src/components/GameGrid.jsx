import * as React from "react";

export default function GameGrid(props) {
 return <table className={'game-grid'}>
   <tbody>
   {
     props.boardMap.map((col, i) => {
       return <tr key={`col_${i}`}>{col.map((item, j) => {
         let cellItem = null;
         if (item) {
           cellItem = typeof item === "object" ? item[item.length - 1] : item;
         }
         return <td key={`item_${j}:${i}`}>
           <small>{`${j}, ${i}`}</small>
           <span className={'grid-item'}>{cellItem && `${props.icons[cellItem]}`}</span>
         </td>
       })}</tr>
     })
   }
   </tbody>
 </table>
}