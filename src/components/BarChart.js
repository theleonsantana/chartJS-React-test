import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function BarChart({ labels, incomingData, chartLabel }) {
	const data = {
		labels: labels,
		datasets: [
			{
				label: chartLabel,
				data: incomingData,
				// fill: false,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		indexAxis: 'y',
		// Elements options apply to all of the options unless overridden in a dataset
		// In this case, we are setting the border of each horizontal bar to be 2px wide
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right',
			},
			title: {
				display: true,
				text: 'Chart.js Horizontal Bar Chart',
			},
		},
	};

	return (
		<div
			style={{
				width: '100%',
				height: 500,
			}}
		>
			<Bar data={data} options={options} />
		</div>
	);
}
