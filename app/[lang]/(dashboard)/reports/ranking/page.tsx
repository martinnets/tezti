"use client";

import { Fragment } from "react";
import RankingPage from "./ranking-page";

export default function EvalutedRankingPage() {
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-medium text-dark-blue">
          Ranking de evaluados
        </h2>
      </div>
      <RankingPage />
    </Fragment>
  );
}
