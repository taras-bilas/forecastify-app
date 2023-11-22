<script>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { useWeatherStore } from './../stores/pinia';
import Chart from 'chart.js/auto';
import { getHourlyTemperature } from './../api';

export default {
  setup() {
    const weatherStore = useWeatherStore();

    const cityName = ref(weatherStore.cityName);
    const chartCanvas = ref(null);
    const chartInstance = ref(null);
    const temperatureData = ref([]);
    const labels = ref([]);

    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    const fetchWeatherData = async () => {
      await getHourlyTemperature(cityName.value)
        .then(response => {
          console.log(response.data);
          processWeatherData(response.data);
        })
        .catch(error => {
          console.error(error);
        })
    };

    const processWeatherData = (data) => {
      const hourlyData = data.list;

      const currentDayData = hourlyData.filter(entry => {
        const date = new Date(entry.dt * 1000);

        return date.getDate() === currentDay;
      });

      labels.value = currentDayData.map(entry => {
        const date = new Date(entry.dt * 1000);

        return `${date.getHours()}:00`;
      });

      temperatureData.value = currentDayData.map(entry => entry.main.temp);

      renderChart();
    };

    const renderChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');

      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.value,
          datasets: [{
            label: 'Temperature (°C)',
            data: temperatureData.value,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchWeatherData();
    });

    watch(cityName, () => {
      fetchWeatherData();
    });

    watchEffect(() => {
      cityName.value = weatherStore.cityName;
    });

    return {
      chartCanvas,
      temperatureData,
      labels
    };
  }
}
</script>

<template>
  <div>
    <canvas ref="chartCanvas" width="100%" height="100%"></canvas>
  </div>
</template>