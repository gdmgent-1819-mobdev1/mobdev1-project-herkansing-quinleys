// Pages
import HomeView from './pages/home';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import LoginView from './pages/login';
import SignUpView from './pages/signup';
import ProfileView from './pages/profile';
import KotenView from './pages/koten';
import KotDetailView from './pages/detailkot';
import TinderView from './pages/tinder';
import MapView from './pages/map';
import LikeView from './pages/like';
import AddKotView from './pages/addKot';
import ChatView from './pages/chat';
import ChatoverviewView from './pages/chatoverview';
import EditKotView from './pages/editkot';
import TermsView from './pages/terms';
import PrivacyView from './pages/privacy';

export default [
  { path: '/', view: HomeView },
  { path: '/about', view: AboutView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/login', view: LoginView },
  { path: '/signup', view: SignUpView },
  { path: '/profile', view: ProfileView },
  { path: '/koten', view: KotenView },
  { path: '/tinder', view: TinderView },
  { path: '/map', view: MapView },
  { path: '/like', view: LikeView },
  { path: '/addKot', view: AddKotView },
  { path: '/detail/:id', view: KotDetailView },
  { path: '/detail/:id/edit', view: EditKotView },
  { path: '/chat/:id', view: ChatView },
  { path: '/chat', view: ChatoverviewView },
  { path: '/terms', view: TermsView },
  { path: '/privacy', view: PrivacyView },
];
