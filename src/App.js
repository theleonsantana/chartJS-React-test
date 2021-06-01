import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
// chart js
// import StaticData from './data/foretell.json';
// import Chart from 'chart.js/auto';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import BrokenLineChart from './components/BrokenLineChart';

function App() {
	const [session, setSession] = useState([]);
	const [aggreage, setAggregate] = useState({
		title: '',
		data: [],
		dataLabels: [],
		xLable: '',
		yLabel: '',
	});
	const [filter, setFilter] = useState({
		filteredData: [],
		filteredLabels: [],
	});
	const [users, setUsers] = useState([]);
	const [segments, setSegments] = useState([]);
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const LineChartContainer = useRef(null);
	const [chartInstance, setChartInstance] = useState(null);
	const [options] = useState([
		'',
		'foretell_avatar_prefab',
		'skin_color_index',
		'hair_color_index',
		'hair_style_index',
		'shirt_index',
		'shirt_color_index',
		'accessories_index',
	]);
	// const [loading, setLoading] = useState(true);
	const [value, setValue] = useState('');

	// http request
	useEffect(() => {
		axios
			.get(
				`https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/userspreferenceaggregate/${value}`
			)
			.then((response) => {
				let data = response.data;
				setAggregate({
					title: data.Title,
					data: data.data,
					dataLabels: data.labelData,
					xLable: data.xLabel,
					yLabel: data.yLabel,
				});
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
		// filterData(aggreage.data);
	}, [value]);

	// const filterData = (arr) => {
	// 	for (let i = 0; i < arr.length; i++) {
	// 		return console.log(arr[i]);
	// 	}
	// };

	// if the element is unmounted make sure to clear the selection, this will be true if there was an api called populating the component

	return (
		<Grid container className="App" style={{ padding: 30 }}>
			{/* <div
			// style={{
			// 	width: 200,
			// 	height: 'auto',
			// }}
			>
				<select
					// disabled={loading}
					style={{
						color: 'black',
						backgroundColor: 'white',
					}}
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
				>
					{options.map((option) => (
						<option value={option}>{option}</option>
					))}
				</select>
			</div>
			<p>
				<b>Session:</b> {aggreage ? aggreage.title : ''}
			</p>
			{value ? (
				<BarChart
					labels={aggreage.dataLabels}
					chartLabels={aggreage.title}
					incomingData={aggreage.data}
				/>
			) : (
				<p>'select parameter'</p>
			)} */}
			<Grid item xs style={{ textAlign: 'left' }}>
				<h1>Aggregate Graph</h1>
				<LineChart />
			</Grid>
			{/* <div>
				<BrokenLineChart />
			</div> */}
		</Grid>
	);
}

export default App;
