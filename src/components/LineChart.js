import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
	labels: aggreage.dataLabels,
	datasets: [
		{
			label: aggreage ? aggreage.title : '..loading',
			data: aggreage.data,
			fill: false,
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgba(255, 99, 132, 0.2)',
		},
	],
};

const options = {
	maintainAspectRatio: false,
	scales: {
		// x: {
		// 	title: {
		// 		color: 'red',
		// 		display: true,
		// 		text: 'Month',
		// 	},
		// },
		// y: {
		// 	title: {
		// 		color: 'red',
		// 		display: true,
		// 		text: 'Month',
		// 	},
		// },
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};

export default function LineChart() {
	return (
		<div
			style={{
				width: '100%',
				height: 500,
			}}
		>
			<Line data={data} options={options} />
		</div>
	);
}
