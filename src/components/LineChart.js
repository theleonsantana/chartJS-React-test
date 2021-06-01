import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
	Grid,
	Paper,
	FormControl,
	Select,
	FormHelperText,
	MenuItem,
	InputLabel,
	Button,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';

function LineChart() {
	const [selectDate, setDate] = useState(moment());
	const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
	const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
	const [incomingData, setIncomingData] = useState({
		aggregates: [],
		data: [],
		dataLabels: [],
		xLabel: '',
		yLabel: '',
		graphTitle: '',
		title: '',
	});
	const [loaded, setLoaded] = useState(false);
	const [timeOptions] = useState(['month', 'year', 'day', 'hour']);
	const [timeSection, setTimeSelection] = useState('month');
	const [sessions, setSessions] = useState([]);
	// http request
	// useEffect(() => {

	// 	// filterData(aggreage.data);
	// }, [startDate, endDate]);

	const handleSubmit = (e) => {
		// let endPoint = `https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/sessionsovertime/hour/${startDate}/${endDate}`;
		let newEndPoint = `https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/sessionsovertime/3/${timeSection}/${startDate}/${endDate}`;
		axios
			.get(newEndPoint)
			.then((response) => {
				let data = response.data;
				setIncomingData({
					aggregates: data.Aggregates[0],
					data: data.Graph.Data,
					dataLabels: data.Graph.labelData,
					xLabel: data.Graph.xLabel,
					yLabel: data.Graph.yLabel,
					graphTitle: data.Graph.graphTitle,
					title: data.Title,
				});
				// console.log(endPoint);
				console.log(data);
				setLoaded(true);
			})
			.catch((error) => {
				console.log(error);
			});
		e.preventDefault();
	};

	const handleStartDate = (startDate, value) => {
		setDate(startDate);
		setStartDate(value);
	};

	const handleEndDate = (endDate, value) => {
		setDate(endDate);
		setEndDate(value);
	};

	const dateFormatter = (str) => {
		return str;
	};

	const handleTimePeriods = (e) => {
		const time = e.target.name;
		setTimeSelection(e.target.value);
	};

	const data = {
		labels: incomingData.dataLabels,
		datasets: [
			{
				label: incomingData.graphTitle,
				data: incomingData.data,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		indexAxis: 'x',
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: incomingData.yLabel,
				},
			},
			x: {
				title: {
					display: true,
					text: incomingData.xLabel,
				},
			},
		},
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
				text: incomingData.graphTitle,
			},
		},
	};

	return (
		<div>
			<Grid container justify="space-around">
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<KeyboardDatePicker
						autoOk={true}
						showTodayButton={true}
						variant="inline"
						format="YYYY-MM-DD"
						margin="normal"
						id="date-picker-inline"
						label="Start Date"
						inputValue={startDate}
						onChange={handleStartDate}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						style={{ marginRight: 10 }}
					/>
					<KeyboardDatePicker
						autoOk={true}
						showTodayButton={true}
						variant="inline"
						format="YYYY-MM-DD"
						margin="normal"
						id="date-picker-inline"
						label="End Date"
						inputValue={endDate}
						onChange={handleEndDate}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						style={{ marginRight: 10 }}
					/>
				</MuiPickersUtilsProvider>
				{/* <div className="options-dates">
					<label>Time:</label>
					<select
						value={timeSection}
						onChange={(e) => setTimeSelection(e.currentTarget.value)}
					>
						{timeOptions.map((timeOpt) => (
							<option value={timeOpt}>{timeOpt}</option>
						))}
					</select>
				</div> */}
				<FormControl style={{ minWidth: 150, marginRight: 10 }}>
					<InputLabel>Time Periods:</InputLabel>
					<Select native value={timeSection} onChange={handleTimePeriods}>
						{timeOptions.map((timeOpt) => (
							<option value={timeOpt}>{timeOpt}</option>
						))}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					size="small"
					color="primary"
					type="submit"
					onClick={handleSubmit}
				>
					Search
				</Button>
			</Grid>

			{loaded && (
				<div>
					<div>
						<h1>Overview</h1>
						<h3>{incomingData.title}</h3>
						<p>
							<b>From: </b>
							{incomingData.aggregates[`From Time`]} <b>To: </b>
							{incomingData.aggregates[`Start Time`]}
						</p>
						<p>
							<b>Avg Length of Session:</b>{' '}
							{incomingData.aggregates[`Avg Length of Session`]}
						</p>
						<p>
							<b>Avg Users Per Session:</b>{' '}
							{incomingData.aggregates[`Avg Users Per Session`]}
						</p>
						<p>
							<b>Total Sessions:</b>{' '}
							{incomingData.aggregates[`Total Session Count`]}
						</p>
					</div>

					{/* <button onClick={handleClear}>Clear</button> */}
					<div
						style={{
							width: '100%',
							height: 500,
						}}
					>
						<Line data={data} options={options} />
					</div>
				</div>
			)}
		</div>
	);
}

export default LineChart;
