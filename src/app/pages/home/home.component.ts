import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignalRService } from '../../services/signalr.service';
import { User } from '../../models/user';
import { ToasterService } from '../../services/toaster.service';
import { HubConnectionState } from '@microsoft/signalr';
import { Connection } from '../../models/connection';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  sideBarItems: MenuItem[];
  settingsItems: MenuItem[];
  breadCrumbItems: MenuItem[] | undefined;
  homeBreadCrumbItem: MenuItem | undefined;

  constructor(public authService: AuthService, public signalRService: SignalRService, public toastrService: ToasterService) {}

  ngOnInit() {  
    this.authService.getCurrentUser().subscribe();  
    this.onUserLogin();
    this.setupMenuItems();
  }

  setupMenuItems(){
    this.getSidebarItems();
    this.getSettingsItems();
    this.setupBreadcrumbs();
  }

  setupBreadcrumbs(){
    this.breadCrumbItems = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];
  }

  getSidebarItems(){
    this.sideBarItems = [
      {
          label: 'Mail',
          icon: 'pi pi-envelope',
          items: [
              {
                  label: 'Compose',
                  icon: 'pi pi-file-edit',
              },
              {
                  label: 'Inbox',
                  icon: 'pi pi-inbox',
              },
              {
                  label: 'Sent',
                  icon: 'pi pi-send',
              },
              {
                  label: 'Trash',
                  icon: 'pi pi-trash',
              }
          ]
      },
      {
          label: 'Reports',
          icon: 'pi pi-chart-bar',
          items: [
              {
                  label: 'Sales',
                  icon: 'pi pi-chart-line',
              },
              {
                  label: 'Products',
                  icon: 'pi pi-list',
              }
          ]
      },
      {
          label: 'Profile',
          icon: 'pi pi-user',
          items: [
              {
                  label: 'Settings',
                  icon: 'pi pi-cog',
              },
              {
                  label: 'Privacy',
                  icon: 'pi pi-shield',
              }
          ]
      }
  ];
  }

  getSettingsItems(){
    this.settingsItems = [
      {
        separator: true
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog',
            },
            {
                label: 'Messages',
                icon: 'pi pi-inbox',
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.logout()
            }
        ]
    },
    {
        separator: true
    }
    ];
  }

  onUserLogin(): void {
    this.signalRService.hubConnection.on("userConnected", (connectionData: Connection) => {
      this.signalRService.currentConnectionData = connectionData;      
      this.toastrService.success("Another user has logged in.");
    });
  }

  logout(){
    return this.authService.logout();
  }
}
