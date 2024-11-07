<template>
  <div class="container">

    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search Categories" class="search-input"
        @input="searchCategories" />
      <button @click="searchCategories" class="search-button">
        <img src="http://localhost:9000/images/search.svg" alt="Search" />
      </button>
    </div>

    <div v-if="filteredCategories.length > 0">
      <div class="categories-grid">
        <div v-for="category in filteredCategories" :key="category.id" class="category"
          @click="goToCategory(category.id)">
          <img :src="'http://localhost:9000/images/' + category.icon + '.svg'" :alt="category.icon" />
          <h3>{{ category.title }}</h3>
          <p class="article-count">{{ category.totalArticle }} articles</p>
          <p class="last-updated">Last updated: {{ getLastUpdatedTime(category.updatedOn) }} ago</p>
        </div>
      </div>
    </div>

    <div v-else class="no-categories">
      <h2>No Categories Found</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      filteredCategories: [],
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:9000/api/categories");
        this.categories = response.data
          .filter((category) => category.enabled)
          .sort((a, b) => a.order - b.order);
        this.filteredCategories = [...this.categories];
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    searchCategories() {
      if (this.searchQuery.trim()) {
        this.filteredCategories = this.categories.filter((category) =>
          category.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredCategories = [...this.categories];
      }
    },
    goToCategory(categoryId) {
      this.$router.push({ name: "categories", params: { id: categoryId } });
    },
    getLastUpdatedTime(updatedOn) {
      const now = new Date();
      const lastUpdated = new Date(updatedOn);
      const diffTime = Math.abs(now - lastUpdated);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 90%;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
  margin-bottom: 50px;

  .search-input {
    width: 100%;
    width: -webkit-fill-available;
    padding: 18px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #9C9AA6;

    &::placeholder {
      font-size: 16px;
      color: #9C9AA6;
    }
  }

  .search-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 8px 20px;
    background-color: #03A84E;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 4rem 6rem;
  background: #fafafa;
  border-radius: 10px;
}

.category {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #ffffff;

  h3 {
    margin-bottom: 10px;
  }

  &:hover {
    background-color: #eef3f7;
  }
}

.no-categories {
  text-align: center;
  font-weight: 600;
  color: #666;
  margin-bottom: 20px;
}

.last-updated {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    display: block;
    padding: 1rem;
  }
  .category{
    margin: 2rem 0;
  }



}

@media (max-width: 480px) {


  .container {
    width: 85%;
    padding: 10px;
  }

  .category h3 {
    font-size: 16px;
  }

  .last-updated {
    font-size: 10px;
  }
}
</style>
