import React from 'react';
import "@esri/calcite-components/dist/components/calcite-card";
import "@esri/calcite-components/dist/components/calcite-rating";
import {
  CalciteCard,
  CalciteRating
} from "@esri/calcite-components-react";

const MovieCard = ({ card }) => {
   const { date, movie, rating, shot_location } = card;
   
   return (
      <CalciteCard>
         <span slot="title">{movie}</span>
         <span slot="subtitle">{date}</span>
         <CalciteRating 
            slot="footer-leading"
            average={rating}
            show-chip
            disabled
         ></CalciteRating>
         <p style={{fontSize: '16px'}}>
            <span style={{color: '#00A0FF'}}>
               <b><i>{movie}</i></b> was filmed in {shot_location}
            </span>
         </p>
      </CalciteCard>
   )
}

export default MovieCard;