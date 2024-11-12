import { LitElement, html, css } from "lit";
import "./project-1-card.js";

export class Project1Analyzer extends LitElement {
  static get properties() {
    return {
      query: { type: String },
      items: { type: Array },
      loading: { type: Boolean },
      error: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }

      .input-container {
        margin-bottom: 20px;
      }

      input {
        width: calc(100% - 120px);
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        width: 100px;
        padding: 8px;
        font-size: 16px;
        background-color: #007acc;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #005fa3;
      }

      .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
    `;
  }

  constructor() {
    super();
    this.query = "";
    this.items = [];
    this.loading = false;
    this.error = false;
  }

  async fetchImages(query) {
    this.loading = true;
    this.error = false;

    try {
      // Using Lorem Picsum for demonstration (random images)
      const response = await fetch(`https://picsum.photos/v2/list?limit=12`);
      const data = await response.json();
      this.items = data.map((item) => ({
        title: `Car ${item.id}`,
        description: "A random car image",
        image: item.download_url,
        contentUrl: item.url,
        sourceUrl: item.download_url,
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  handleSearch() {
    if (!this.query) {
      this.error = true;
      return;
    }
    this.fetchImages(this.query);
  }

  renderCards() {
    if (!this.items || this.items.length === 0) return html`<p>No results found.</p>`;

    return html`
      <div class="cards">
        ${this.items.map(
          (item) => html`
            <project-1-card
              .title="${item.title}"
              .description="${item.description}"
              .image="${item.image}"
              .contentUrl="${item.contentUrl}"
              .sourceUrl="${item.sourceUrl}"
            ></project-1-card>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="input-container">
        <input
          type="text"
          placeholder="Type 'cars' or any query (mock data)"
          @input="${(e) => (this.query = e.target.value)}"
        />
        <button @click="${this.handleSearch}">Search</button>
      </div>

      ${this.error ? html`<p style="color: red;">Error fetching images.</p>` : null}

      ${this.loading ? html`<p>Loading...</p>` : this.renderCards()}
    `;
  }
}

customElements.define('project-1-analyzer', Project1Analyzer);