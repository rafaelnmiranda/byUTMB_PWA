import streamlit as st
import requests
import json
from datetime import datetime
import os

# Configuração da página
st.set_page_config(
    page_title="byUTMB PWA",
    page_icon="🏃‍♂️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS customizado
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
    }
    
    .hero-card {
        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3');
        background-size: cover;
        background-position: center;
        padding: 3rem;
        border-radius: 15px;
        margin: 1rem 0;
        color: white;
        text-align: center;
    }
    
    .info-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
        border-left: 4px solid #667eea;
    }
    
    .event-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin: 1rem 0;
        color: white;
        text-align: center;
    }
    
    .metric-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e9ecef;
    }
</style>
""", unsafe_allow_html=True)

# Função para carregar dados (simulando a integração com Google Sheets)
@st.cache_data
def load_event_data():
    """Carrega dados dos eventos"""
    # Simulando dados dos eventos - em produção, isso viria da API do Google Sheets
    events = [
        {
            "name": "PTR 20",
            "date": "06 Setembro 2024",
            "time": "07:00",
            "location": "Pontal Beach",
            "distance": "20 KM",
            "elevation": "1.100 D+",
            "status": "Próximo"
        },
        {
            "name": "Trail Running Festival",
            "date": "15 Outubro 2024",
            "time": "06:30",
            "location": "Paraty Centro",
            "distance": "15 KM",
            "elevation": "800 D+",
            "status": "Em Breve"
        }
    ]
    return events

def main():
    # Header principal
    st.markdown("""
    <div class="main-header">
        <h1>🏃‍♂️ byUTMB PWA</h1>
        <p>Paraty Brazil by UTMB - Trail Running Experience</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar para navegação
    with st.sidebar:
        st.image("https://via.placeholder.com/200x100/667eea/ffffff?text=LOGO", width=200)
        
        st.markdown("### 🧭 Navegação")
        page = st.selectbox(
            "Escolha uma página:",
            ["🏠 Home", "📅 Agenda", "🏃‍♂️ Corridas", "🗺️ Explorar", "📸 Mídia"]
        )
        
        st.markdown("### 🌐 Idioma")
        language = st.selectbox("Idioma:", ["🇧🇷 Português", "🇺🇸 English"])
        
        st.markdown("### 🌙 Tema")
        theme = st.selectbox("Tema:", ["🌞 Claro", "🌙 Escuro"])
        
        st.markdown("---")
        st.markdown("### 📱 PWA")
        if st.button("📲 Instalar App"):
            st.success("App instalado com sucesso!")
    
    # Conteúdo principal baseado na página selecionada
    if page == "🏠 Home":
        show_home_page()
    elif page == "📅 Agenda":
        show_agenda_page()
    elif page == "🏃‍♂️ Corridas":
        show_races_page()
    elif page == "🗺️ Explorar":
        show_explore_page()
    elif page == "📸 Mídia":
        show_media_page()

def show_home_page():
    st.markdown("### 🎯 Próximo Evento")
    
    # Card do próximo evento
    st.markdown("""
    <div class="event-card">
        <h2>PTR 20</h2>
        <p><strong>06 Setembro • Largada 07:00 • Pontal Beach</strong></p>
        <div style="margin-top: 1rem;">
            <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                20 KM • 1.100 D+
            </span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Seção de highlights
    st.markdown("### ✨ Destaques")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="info-card">
            <h3>📅 Agenda</h3>
            <p>Confira a programação completa dos eventos de trail running em Paraty.</p>
            <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                Ver Agenda
            </button>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="info-card">
            <h3>🏃‍♂️ Corridas</h3>
            <p>Descubra as diferentes modalidades e distâncias disponíveis.</p>
            <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                Ver Corridas
            </button>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="info-card">
            <h3>🗺️ Explorar</h3>
            <p>Conheça as trilhas e paisagens incríveis de Paraty.</p>
            <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                Explorar
            </button>
        </div>
        """, unsafe_allow_html=True)
    
    # Hero section
    st.markdown("""
    <div class="hero-card">
        <h1>Paraty Brazil by UTMB</h1>
        <p>Viva a experiência única do trail running em uma das cidades mais bonitas do Brasil</p>
        <button style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-size: 1.1rem;">
            🏃‍♂️ Inscreva-se Agora
        </button>
    </div>
    """, unsafe_allow_html=True)

def show_agenda_page():
    st.markdown("### 📅 Agenda de Eventos")
    
    events = load_event_data()
    
    for event in events:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown(f"""
            <div class="info-card">
                <h3>{event['name']}</h3>
                <p><strong>📅 Data:</strong> {event['date']}</p>
                <p><strong>🕐 Horário:</strong> {event['time']}</p>
                <p><strong>📍 Local:</strong> {event['location']}</p>
                <p><strong>📏 Distância:</strong> {event['distance']}</p>
                <p><strong>⛰️ Elevação:</strong> {event['elevation']}</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card">
                <h4>Status</h4>
                <h2 style="color: #667eea;">{event['status']}</h2>
                <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; width: 100%;">
                    Inscrever-se
                </button>
            </div>
            """, unsafe_allow_html=True)

def show_races_page():
    st.markdown("### 🏃‍♂️ Modalidades de Corrida")
    
    races = [
        {"name": "PTR 20", "distance": "20 KM", "elevation": "1.100 D+", "difficulty": "Intermediário"},
        {"name": "PTR 15", "distance": "15 KM", "elevation": "800 D+", "difficulty": "Iniciante"},
        {"name": "PTR 10", "distance": "10 KM", "elevation": "500 D+", "difficulty": "Iniciante"},
        {"name": "PTR 5", "distance": "5 KM", "elevation": "200 D+", "difficulty": "Família"}
    ]
    
    for race in races:
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            st.markdown(f"""
            <div class="info-card">
                <h3>{race['name']}</h3>
                <p><strong>Distância:</strong> {race['distance']}</p>
                <p><strong>Elevação:</strong> {race['elevation']}</p>
                <p><strong>Dificuldade:</strong> {race['difficulty']}</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card">
                <h4>Dificuldade</h4>
                <h3 style="color: #667eea;">{race['difficulty']}</h3>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class="metric-card">
                <h4>Ação</h4>
                <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; width: 100%;">
                    Detalhes
                </button>
            </div>
            """, unsafe_allow_html=True)

def show_explore_page():
    st.markdown("### 🗺️ Explorar Paraty")
    
    st.markdown("""
    <div class="hero-card">
        <h2>Descubra as Trilhas de Paraty</h2>
        <p>Explore as paisagens únicas da Costa Verde do Brasil</p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="info-card">
            <h3>📍 Trilhas Principais</h3>
            <ul>
                <li>Trilha do Saco do Mamanguá</li>
                <li>Caminho do Ouro</li>
                <li>Trilha da Pedra Branca</li>
                <li>Serra da Bocaina</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="info-card">
            <h3>🏞️ Pontos de Interesse</h3>
            <ul>
                <li>Centro Histórico</li>
                <li>Praia do Sono</li>
                <li>Cachoeira do Tobogã</li>
                <li>Ilha do Pelado</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    # Mapa interativo (simulado)
    st.markdown("### 🗺️ Mapa Interativo")
    st.map({
        "latitude": [-23.2200, -23.2300, -23.2100],
        "longitude": [-44.7200, -44.7300, -44.7100]
    })

def show_media_page():
    st.markdown("### 📸 Galeria de Mídia")
    
    # Simulando galeria de fotos
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.image("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400", 
                caption="Trail Running em Paraty")
    
    with col2:
        st.image("https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&w=400", 
                caption="Paisagem da Costa Verde")
    
    with col3:
        st.image("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&w=400", 
                caption="Centro Histórico de Paraty")
    
    # Vídeos
    st.markdown("### 🎥 Vídeos")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")  # Placeholder
    
    with col2:
        st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")  # Placeholder

if __name__ == "__main__":
    main()
