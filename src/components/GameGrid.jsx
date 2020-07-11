import * as React from "react";

export default function GameGrid(props) {
  const icons = {
    bunny: '#',
    fox: '$',
    rock: '^',
    flower: '*',
    burrow: '@',
    win: '(@)',
    loss: ':('
  };

 return <table className={'game-grid'}>
   <tbody>
   {
     props.map.map((col, i) => {
       return <tr key={`col_${i}`}>{col.map((item, j) => {
         return <td key={`item_${j}:${i}`}>
           <small>{`${j}, ${i}`}</small>
           <span className={'grid-item'}>{item && `${icons[item]}`}</span>
         </td>
       })}</tr>
     })
   }
   </tbody>
 </table>
}