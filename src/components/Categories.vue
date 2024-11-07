<template>
    <div class="">
        <div class="search-container">
            <input type="text" v-model="searchQuery" placeholder="Search Articles" class="search-input"
                @input="searchArticles" />
            <button @click="searchArticles" class="search-button">
                <img src="http://localhost:9000/images/search.svg" alt="Search" />
            </button>
        </div>

        <div class="container">
            <div class="breadcrumb">
                <span class="category-breadcrumb">
                    <router-link to="/" class="breadcrumb-link">All categories</router-link> &nbsp;
                </span>
                &gt;
                <span>&nbsp;{{ selectedCategory ? selectedCategory.title : '' }}</span>
            </div>

            <div class="grid-container">


                <div class="category-section">

                    <div v-if="selectedCategory" class="category">

                        <div class="article-no">
                            <img src="http://localhost:9000/images/file.svg" alt="info">
                            <p class="">{{ selectedCategory.totalArticle }}</p>
                        </div>

                        <img :src="'http://localhost:9000/images/' + selectedCategory.icon + '.svg'"
                            :alt="selectedCategory.icon" />


                        <h3>{{ selectedCategory.title }}</h3>
                        <p class="last-updated">
                            Last updated: {{ getLastUpdatedTime(selectedCategory.updatedOn) }} ago
                        </p>

                        <div class="category-details">
                            <img src="http://localhost:9000/images/info.svg" alt="info">
                            <p class="last-updated">{{ selectedCategory.description }}</p>
                        </div>

                    </div>

                </div>


                <div class="articles-section">
                    <div v-if="filteredArticles.length > 0">
                        <ul>
                            <li v-for="article in filteredArticles" :key="article.id" class="article-item-container">
                                <div class="article-item">

                                    <div class="article-icon-left">
                                        <img src="http://localhost:9000/images/file.svg" alt="Icon" />
                                    </div>
                                    <div class="article-content">
                                        <h4>{{ article.title }}</h4>
                                        <p>{{ formatUpdatedOn(article.updatedOn) }}</p>
                                    </div>
                                    <div class="article-icon-right">
                                        <img src="http://localhost:9000/images/next.svg" alt="Next"
                                            @click="toggleContent(article)" />
                                    </div>
                                </div>

                                <div>
                                    <p class="article-content-p" v-if="article.showContent">{{ article.content }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>No articles found for this category.</p>
                    </div>
                </div>
            </div>

            <div v-if="paginatedOtherCategories.length > 0" class="other-categories-container">
                <div class="other-categories-content">
                    <h2 class="other-categories-heading">Other Categories</h2>

                    <div class="pagination-controls">
                        <button @click="changePage('prev')" :disabled="currentPage === 0" class="pagination-button">
                            &lt;
                        </button>

                        <div class="other-categories-grid">
                            <div v-for="category in paginatedOtherCategories" :key="category.id" class="other-category"
                                @click="goToCategory(category.id)">
                                <img :src="'http://localhost:9000/images/' + category.icon + '.svg'"
                                    :alt="category.icon" />
                                <h3>{{ category.title }}</h3>
                                <p class="article-count">{{ category.totalArticle }} articles</p>
                                <p class="last-updated">Last updated: {{ getLastUpdatedTime(category.updatedOn) }} ago
                                </p>
                            </div>
                        </div>

                        <button @click="changePage('next')"
                            :disabled="(currentPage + 1) * itemsPerPage >= otherCategories.length"
                            class="pagination-button">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['id'],
    data() {
        return {
            selectedCategory: null,
            articles: [],
            categories: [],
            filteredArticles: [],
            searchQuery: '',
            otherCategories: [],
            currentPage: 0,
            itemsPerPage: 3
        };
    },
    computed: {
        paginatedOtherCategories() {
            const start = this.currentPage * this.itemsPerPage;
            return this.otherCategories.slice(start, start + this.itemsPerPage);
        }
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:9000/api/categories');
                this.categories = response.data.filter(category => category.enabled);
                this.selectedCategory = this.categories.find(category => category.id === this.id);

                // Filter out the selected category and initialize otherCategories
                this.otherCategories = this.categories.filter(category => category.id !== this.id);

                if (this.selectedCategory) {
                    this.fetchArticles(this.selectedCategory.id);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchArticles(categoryId) {
            try {
                const response = await axios.get(`http://localhost:9000/api/category/${categoryId}`);
                this.articles = response.data
                    .filter(article => article.status === 'published')
                    .map(article => ({
                        ...article,
                        showContent: false
                    }));
                this.filteredArticles = this.articles;
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        },
        searchArticles() {
            if (this.searchQuery.trim()) {
                this.filteredArticles = this.articles.filter(article =>
                    article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            } else {
                this.filteredArticles = this.articles;
            }
        },
        getLastUpdatedTime(updatedOn) {
            const now = new Date();
            const lastUpdated = new Date(updatedOn);
            const diffTime = Math.abs(now - lastUpdated);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
        },
        formatUpdatedOn(dateStr) {
            const date = new Date(dateStr);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            return `Updated ${date.toLocaleDateString('en-US', options)}`;
        },
        toggleContent(article) {
            article.showContent = !article.showContent;
        },
        changePage(direction) {
            if (direction === 'next' && (this.currentPage + 1) * this.itemsPerPage < this.otherCategories.length) {
                this.currentPage++;
            } else if (direction === 'prev' && this.currentPage > 0) {
                this.currentPage--;
            }
        },
        goToCategory(categoryId) {
            this.selectedCategory = this.categories.find(category => category.id === categoryId);
            this.fetchArticles(categoryId);
            this.$router.push({ name: "categories", params: { id: categoryId } });
            window.location.reload();
        }
    }
};
</script>

<style lang="scss" scoped>
@use '@/scss/_variables' as *;

.container {
    width: 75%;
    margin: 0 auto;
    padding: 4rem 6rem;
    background: #fafafa;
    border-radius: 10px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 1rem;
    }
}

.breadcrumb {
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;

    .breadcrumb-link {
        color: #03a84e;
        text-decoration: none;
        cursor: pointer;
    }
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


.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
}

.articles-section ul {
    padding: 0;
    list-style: none;
}

.article-item-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #ffffff;
    margin-bottom: 1rem;
    padding: 1rem;
}

.article-item {
    display: flex;
    align-items: center;
}

.article-icon-left,
.article-icon-right {
    flex: 1;
    max-width: 10%;

    @media (max-width: 768px) {
        max-width: 20px;
    }
}

.article-content {
    flex: 8;
    padding: 0 15px;

    h4 {
        font-size: 18px;
    }

    p {
        color: #777;
    }
}

.article-content-p {
    padding: 1rem;
    font-size: 1.2rem;
    line-height: 2rem;
    color: #5f5353cc;
    text-align: justify;

    @media (max-width: 768px) {
        font-size: 1rem;
        line-height: 1.6rem;
    }
}

.category {
    position: relative;
    padding: 2rem;
    border: 1px solid #ccc;
    margin: 10px 0;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }

    @media (max-width: 768px) {
        padding: 1rem;
    }
}

.category-details {
    padding: 1rem 0;
    border-top: 1px solid #EEEEEE;
    margin-top: 2rem;
}

.category-section {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    text-align: center;
    margin-right: 36px;

    @media (max-width: 768px) {
        margin-right: 0;
    }
}

.other-categories-container {
    margin-top: 2rem;
    padding: 1rem;
    border-top: 2px solid #EEEEEE;
    background-color: #fafafa;

    .other-categories-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        flex-grow: 1;
        margin-top: 20px;

        .other-category {
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background-color: #ffffff;
            transition: background-color 0.3s;

            &:hover {
                background-color: #f5f5f5;
            }

            h3 {
                margin-bottom: 10px;
            }

            @media (max-width: 768px) {
                padding: 1rem;
                font-size: 0.9rem;
            }
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .other-categories-heading {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        color: #666;
        margin-bottom: 20px;

        @media (max-width: 768px) {
            font-size: 1.2rem;
        }
    }
}

.pagination-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 1rem 0;

    .pagination-button {
        background-color: #03A84E;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }
}
</style>


