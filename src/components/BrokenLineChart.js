import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function BrokenLineChart() {
	const [timeZone, setTimeZone] = useState('');
	const [aggregates, setAggregates] = useState([]);
	const [session, setSession] = useState('');
	const [incomingData, setIncomingData] = useState({
		data: [],
		dataLabels: [],
		yLabels: [],
		xAxis: '',
		yAxis: '',
		graphTitle: '',
		title: '',
	});
	const [loaded, setLoaded] = useState(false);
	const chart = useRef(null);

	const getCreateTooltip = (chart) => {
		let tooltipEl = null;
	};

	const handleTooltip = (context) => {
		const { chart, tooltip } = context;
		const tooltipEl = getCreateTooltip(chart);
	};

	const data = {
		labels: incomingData.dataLabels,
		datasets: incomingData.data,
	};

	// const zoomOpt = {
	// 	limits: {
	// 		x: { min: -200, max: 200, minRange: 50 },
	// 		y: { min: -200, max: 200, minRange: 50 },
	// 	},
	// 	pan: {
	// 		enabled: true,
	// 		mode: 'xy',
	// 	},
	// 	zoom: {
	// 		wheel: {
	// 			enabled: true,
	// 		},
	// 		pinch: {
	// 			enabled: true,
	// 		},
	// 		mode: 'xy',
	// 	},
	// };

	const options = {
		type: 'line',
		// indexAxis: 'y',
		responsive: true,
		legend: { display: false },
		interaction: {
			intersect: false,
		},
		plugins: {
			title: {
				display: true,
				text: incomingData.graphTitle,
			},
			tooltip: {
				// enabled: false,
				position: 'nearest',
				// external: null,
			},
			// 	zoom: zoomOpt,
			// add scales options. (Aks Joe for Help)
		},
		scales: {
			y: {
				min: 0,
				// max: 4,
				ticks: {
					stepSize: 1,
					callback: function (value, index, values) {
						// console.log('value, index, values', value, index, values);
						return incomingData.yLabels[index];
					},
				},
				title: {
					display: true,
					text: incomingData.yAxis,
				},
			},
			x: {
				title: {
					display: true,
					text: incomingData.xAxis,
				},
			},
		},
		elements: {
			point: {
				radius: function adjustLineEndPoints(context) {
					var y = context.parsed.y;
					var index = context.parsed.x;
					if (
						y != null &&
						(incomingData.data[y - 1]['data'][index - 1] == null ||
							incomingData.data[y - 1]['data'][index + 1] == null)
					) {
						return 5;
					}
					return 0;
				},
			},
		},
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const randomColor = () => {
			return 'hsl(' + 360 * Math.random() + ',' + '70%,' + '50%)';
		};
		const changeSaturation = (colorHSL) => {
			return colorHSL.replace('50', function () {
				return Math.floor(Math.random() * (85 - 75 + 1)) + 75;
			});
		};

		axios
			.get(
				`https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/userbreakdown/3/${session}/${timeZone}`
			)
			.then((response) => {
				let data = response.data;
				let periods = [];
				let yLabels = [];

				setAggregates(data.Aggregates[0]);
				yLabels.push('');
				data.Graph.Data.forEach((userData) => {
					let color = randomColor();
					yLabels.push(userData.username);
					let dataSet = {
						data: userData.periods,
						label: userData.username,
						tension: 0,
						fill: false,
						backgroundColor: color,
						borderColor: changeSaturation(color),
					};
					periods.push(dataSet);
				});
				yLabels.push('');
				setIncomingData({
					data: periods,
					dataLabels: data.Graph.labelData,
					yLabels: yLabels,
					xAxis: data.Graph.xLabel,
					yAxis: data.Graph.yLabel,
					graphTitle: data.Graph.graphTitle,
					title: data.Title,
				});
				setLoaded(true);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSessionID = (e) => {
		setSession(e.target.value);
		e.preventDefault();
	};

	useEffect(() => {
		let TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setTimeZone(TimeZone);
		console.log(chart);
	}, [incomingData]);

	return (
		<div style={{ padding: 50 }}>
			<div style={{ marginBottom: 50 }}>
				<form onSubmit={handleSubmit}>
					<label>Session ID</label>
					<input input={session || ''} onChange={handleSessionID} type="text" />
					<button type="submit">Find Session</button>
				</form>
			</div>
			{loaded && session ? (
				<div
					style={{
						display: 'flex',
						flexFlow: 'row no-wrap',
					}}
				>
					<div style={{ marginRight: 40, textAlign: 'left' }}>
						<h2>{incomingData.title}</h2>
						<p>
							<b>Session Name: </b>
							{aggregates[`Session Name`]}
						</p>
						<p>
							<b>From: </b>
							{aggregates[`Start Time`]} <b>To: </b>
							{aggregates[`End Time`]}
						</p>
						<p>
							<b>Number of Unique Users:</b>
							{` `}
							{aggregates[`Number of Unique Users`]}
						</p>
						<p>
							<b>Total Connections: </b>
							{aggregates[`Total Connections`]}
						</p>
						<div style={{ color: `red` }}>
							{' '}
							<b>Test</b> session: {session} Timezone: {timeZone}
						</div>
					</div>
					<div style={{ width: `60%`, height: 150 }}>
						<Line data={data} options={options} ref={chart} />
					</div>
				</div>
			) : (
				<p>Enter a valid session</p>
			)}
		</div>
	);
}

export default BrokenLineChart;
