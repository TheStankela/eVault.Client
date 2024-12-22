import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  sideBarItems: MenuItem[];
  settingsItems: MenuItem[];
  breadCrumbItems: MenuItem[] | undefined;
  homeBreadCrumbItem: MenuItem | undefined;
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {  
    this.authService.getCurrentUser().subscribe();  

    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
    });

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

  logout(){
    return this.authService.logout();
  }
}
