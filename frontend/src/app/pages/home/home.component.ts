import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="home-container">


      <!-- HERO -->
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-text">
            <h1>Welcome to MazeBank</h1>
            <p class="lead">Secure, fast and modern banking — designed for you.</p>
            <p class="subtitle">Manage accounts, transfer funds and track expenses with confidence.</p>

            <div class="hero-buttons">
              <ng-container *ngIf="auth.isLoggedIn(); else guestHero">
                <a [routerLink]="auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard'" mat-raised-button color="accent" class="btn-large">
                  <mat-icon>dashboard</mat-icon> Dashboard
                </a>
                <button mat-raised-button class="btn-large" (click)="auth.logout()">
                  <mat-icon>logout</mat-icon> Logout
                </button>
              </ng-container>
              <ng-template #guestHero>
                <button mat-raised-button color="accent" class="btn-large" (click)="openRegister()">
                  <mat-icon>person_add</mat-icon> Get Started
                </button>
                <button mat-stroked-button class="btn-large" (click)="openLogin()">
                  <mat-icon>login</mat-icon> Sign In
                </button>
              </ng-template>
            </div>
          </div>

          <div class="hero-illustration" aria-hidden>
            <!-- Decorative SVG with embedded logo image placed at the rectangle (x=200,y=60) -->
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" class="illustration">
              <defs>
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0072ff" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="400" rx="16" fill="url(#g1)" opacity="0.12" />
              <g fill="#fff" opacity="0.95">
                <circle cx="120" cy="120" r="32" />
                <!-- background rectangle (logo area intentionally left blank) -->
                <rect x="200" y="60" width="240" height="40" rx="8" fill="#ffffff" opacity="0.02" />
                <rect x="220" y="120" width="180" height="22" rx="6" />
                <rect x="220" y="154" width="120" height="22" rx="6" />
                <rect x="200" y="200" width="240" height="120" rx="12" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="stats">
        <div class="stats-inner">
          <div class="stat">
            <h3>1.2M+</h3>
            <p>Accounts</p>
          </div>
          <div class="stat">
            <h3>99.99%</h3>
            <p>Uptime</p>
          </div>
          <div class="stat">
            <h3>500K+</h3>
            <p>Transactions/month</p>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="features">
        <h2>Core Capabilities</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <div class="feature-head">
              <div class="icon-circle"><mat-icon>bolt</mat-icon></div>
              <mat-card-title>Instant Deposits</mat-card-title>
            </div>
            <mat-card-content>
              <p>Funding accounts instantly from linked sources with immediate balance updates.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <div class="feature-head">
              <div class="icon-circle"><mat-icon>lock</mat-icon></div>
              <mat-card-title>Secure Withdrawals</mat-card-title>
            </div>
            <mat-card-content>
              <p>Bank-grade withdrawal flows with multi-factor confirmation to keep funds safe.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <div class="feature-head">
              <div class="icon-circle"><mat-icon>swap_horiz</mat-icon></div>
              <mat-card-title>Peer-to-Peer Transfers</mat-card-title>
            </div>
            <mat-card-content>
              <p>Send money to friends and businesses quickly with optimized rails and confirmations.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <div class="feature-head">
              <div class="icon-circle"><mat-icon>search</mat-icon></div>
              <mat-card-title>Searchable Transaction History</mat-card-title>
            </div>
            <mat-card-content>
              <p>Query transactions, filter by date or amount, and export statements in a few clicks.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- TESTIMONIAL -->
      <section class="testimonial">
        <mat-card class="testimonial-card">
          <div class="test-row">
            <div class="avatar avatar-icon"><mat-icon>person</mat-icon></div>
            <div class="quote">
              <p class="text">"MazeBank made managing my business accounts so much easier — fast transfers and great support."</p>
              <p class="who">— Priya R., Small Business Owner</p>
            </div>
          </div>
        </mat-card>
      </section>

      <!-- CTA -->
      <section class="cta">
        <div class="cta-content">
          <ng-container *ngIf="auth.isLoggedIn(); else guestCta">
            <h2>Welcome back</h2>
            <p>Access your dashboard to continue where you left off.</p>
          </ng-container>
          <ng-template #guestCta>
            <h2>Ready to start smart banking?</h2>
            <p>Create an account in minutes and get started.</p>
          </ng-template>

          <div class="cta-buttons">
            <ng-container *ngIf="auth.isLoggedIn(); else guestCtaButtons">
              <a [routerLink]="auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard'" mat-raised-button color="accent" class="btn-large">
                <mat-icon>dashboard</mat-icon> Go to Dashboard
              </a>
            </ng-container>
            <ng-template #guestCtaButtons>
              <button mat-raised-button color="accent" class="btn-large" (click)="openRegister()">Create Account</button>
              <button mat-stroked-button class="btn-large" (click)="openLogin()">Sign In</button>
            </ng-template>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>About</h4>
            <p>MazeBank is a modern digital banking platform dedicated to secure and convenient financial services.</p>
            <div class="security-badge" style="margin-top:12px;">
              <mat-icon>verified</mat-icon>
              <div>
                <div style="font-weight:700;color:#e6f0ff;">256-bit AES Encryption</div>
                <div style="font-size:12px;color:#b7c7e6;">All sensitive data encrypted at rest and in transit</div>
              </div>
            </div>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul *ngIf="!auth.isLoggedIn()">
              <li><a routerLink="/login">Login</a></li>
              <li><a routerLink="/register">Register</a></li>
              <li><a routerLink="/admin-login">Admin</a></li>
            </ul>
            <ul *ngIf="auth.isLoggedIn()">
              <li><a routerLink="/">Home</a></li>
              <li><a [routerLink]="auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard'">Dashboard</a></li>
              <li><a routerLink="/" (click)="auth.logout()">Logout</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Email: support&#64;mazebank.com</p>
            <p>Phone: 1800 675 4568</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 MazeBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(180deg, #f7fbff 0%, #f5f7fb 100%);
      color: #1b1f3b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    }



    /* HERO */
    .hero {
      padding: 56px 24px;
      background: transparent;
    }

    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 32px;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(90deg, rgba(26,35,126,0.9), rgba(1,87,155,0.85));
      padding: 36px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(2,6,23,0.12);
      color: white;
    }

    .hero-text h1 {
      font-size: 42px;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .lead {
      font-size: 18px;
      margin-top: 6px;
      color: rgba(255,255,255,0.95);
    }

    .subtitle {
      margin-top: 12px;
      color: rgba(255,255,255,0.85);
    }

    .hero-buttons {
      margin-top: 22px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-large { padding: 10px 22px !important; }

    .hero-illustration { width: 340px; display: flex; align-items: center; justify-content: center; }

    .illustration { width: 320px; height: auto; transform: translateY(-4px); filter: drop-shadow(0 8px 20px rgba(3,31,56,0.15)); }

    /* STATS */
    .stats { margin: 28px 0; }
    .stats-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 16px; justify-content: center; }
    .stat { background: white; padding: 18px 28px; border-radius: 12px; min-width: 160px; text-align: center; box-shadow: 0 6px 18px rgba(17,24,39,0.06); }
    .stat h3 { margin: 0; font-size: 20px; color: #0d47a1; }
    .stat p { margin: 4px 0 0; color: #56607a; }

    /* FEATURES */
    .features { max-width: 1200px; margin: 36px auto; padding: 0 24px; }
    .features h2 { text-align: center; font-size: 28px; margin-bottom: 24px; color: #12203a; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .feature-card { border-radius: 12px; padding: 20px; text-align: left; background: white; transition: transform 220ms ease, box-shadow 220ms ease; cursor: default; }
    .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(11,23,60,0.08); }
    .feature-head { display:flex; align-items:center; gap:12px; }
    .icon-circle { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg,#e8f2ff,#d8eaff); color:#004fcf; font-size:20px; }
    .feature-card mat-card-title { font-weight:700; color:#0b2b52; margin:0; }
    .feature-card p { color:#475569; margin-top:10px; }

    /* TESTIMONIAL */
    .testimonial { max-width: 900px; margin: 20px auto; padding: 0 16px; }
    .testimonial-card { padding: 14px 18px; border-radius: 12px; box-shadow: 0 8px 30px rgba(11,23,60,0.06); }
    .test-row { display:flex; gap:16px; align-items:center; }
    .avatar { width:64px; height:64px; border-radius:50%; object-fit:cover; }
    .avatar-icon { width:64px; height:64px; border-radius:50%; background:#e9f3ff; display:flex; align-items:center; justify-content:center; color:#004fcf; font-size:28px; }
    .quote .text { font-style: italic; margin:0; color:#12203a; }
    .who { margin:6px 0 0; color:#56607a; font-weight:600; }

    /* CTA */
    .cta { margin: 36px 0; }
    .cta-content { max-width: 1000px; margin: 0 auto; text-align: center; padding: 28px; background: linear-gradient(90deg,#311b92 0%,#4a148c 100%); color: #fff; border-radius: 12px; }
    .cta-content h2 { margin: 0 0 8px; font-size: 26px; }
    .cta-content p { margin: 0 0 16px; color: rgba(255,255,255,0.92); }

    /* FOOTER */
    .footer { background: #0b1220; color: #d6e3ff; padding: 40px 24px 20px; margin-top: auto; }
    .footer-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 18px; }
    .footer-section h4 { color: #e6f0ff; }
    .footer-section p, .footer-section li a { color: #b7c7e6; }
    .security-badge { display:flex; gap:10px; align-items:center; background: rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.04); }
    .security-badge mat-icon { color:#7fb3ff; }
    .footer-bottom { text-align:center; padding-top:10px; color:#91a8d3; }

    /* RESPONSIVE */
    @media (max-width: 880px) {
      .hero-inner { flex-direction: column; padding: 24px; }
      .hero-illustration { width: 100%; }
      .hero-text h1 { font-size: 28px; }
      .stats-inner { flex-direction: column; gap: 12px; align-items: center; }
      .features-grid { grid-template-columns: 1fr; }
      .cta-content { padding: 20px; }
    }
  `]
})
export class HomeComponent {
  constructor(public auth: AuthService, public router: Router) {}

  openRegister(): void {
    if (this.auth.isLoggedIn()) {
      // If already logged in, go to respective dashboard instead of registration
      const route = this.auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard';
      this.router.navigate([route]);
      return;
    }
    this.router.navigate(['/register']);
  }

  openLogin(): void {
    if (this.auth.isLoggedIn()) {
      const route = this.auth.getRole() === 'ADMIN' ? '/admin' : '/dashboard';
      this.router.navigate([route]);
      return;
    }
    this.router.navigate(['/login']);
  }
}

