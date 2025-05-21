import React from "react";

export function Card(props) {
  return <div className="bg-white rounded shadow p-4" {...props}>{props.children}</div>;
}

export function CardContent(props) {
  return <div className="p-4" {...props}>{props.children}</div>;
}