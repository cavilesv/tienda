import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, 
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonicModule, RouterModule, CommonModule
  ],
})
export class DashboardComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {}

}
