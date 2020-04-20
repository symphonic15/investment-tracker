import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions
} from "./charts";

import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  marketUpdates;
  operations;

  salesChart;

  constructor(
    private ipcService: IpcService
  ) {
    this.marketUpdates = this.ipcService.getMarketUpdates();
    this.operations = ipcService.getAllOperations();
  }

  ngOnInit(): void {
    parseOptions(Chart, chartOptions());
    
    var chartSales = document.getElementById('chart-sales');
    
    var labels = ['Start'];
    labels.push.apply(labels, this.marketUpdates.map(x => x.date));
    var datasets = [0];
    datasets.push.apply(datasets, this.marketUpdates.map(x => x.cur_profit));

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: {
        scales: {
          yAxes: [{
            gridLines: {
              color: '#212529',
              zeroLineColor: '#212529'
            },
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }]
        }
      },
      data: {
        labels: labels,
        datasets: [{
          label: 'Profit/loss',
          data: datasets
        }]
      }
		});
  }

}
