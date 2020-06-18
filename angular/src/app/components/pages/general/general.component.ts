import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  historyChart;

  constructor(
    private ipcService: IpcService,
    private modalService: NgbModal
  ) {
    this.marketUpdates = ipcService.getMarketUpdates();
    this.operations = ipcService.getAllOperations();
  }

  ngOnInit(): void {
    this.updateHistoryChart();
  }

  updateHistoryChart() {
    parseOptions(Chart, chartOptions());
    
    var chartHistory = document.getElementById('chart-history');
    
    var labels = ['Start'];
    labels.push.apply(labels, this.marketUpdates.map(x => x.date));
    var datasets = [0];
    datasets.push.apply(datasets, this.marketUpdates.map(x => x.cur_profit.toFixed(2)));

    this.historyChart = new Chart(chartHistory, {
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

  openClearModal(content) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.ipcService.clearMarketUpdates();
      this.marketUpdates = this.ipcService.getMarketUpdates();
      this.operations = this.ipcService.getAllOperations();
      this.updateHistoryChart();
    }, () => {});
  }

}
