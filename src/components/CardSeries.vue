<script lang="ts">
export default {
  props: {
    img: String,
    ages: Number,
    title: String,
    type: String,
    resourcesRelatedNumber: String
  },
  computed:{
    getTypeStyle(){
      if(this.type === 'limited'){
        return 'blue'
      }
      if(this.type === 'collection'){
        return 'orange'
      }
      if(this.type === 'one shot'){
        return 'red'
      }
      if(this.type === 'ongoing'){
        return 'green'
      }
      return 'gray'
    }
  }
}
</script>
<template>
  <div class="card">
    <img :src="img" alt="Avatar" style="width: 100%; height: 320px" />
    <div class="container-card">
      <h4><b>Title: {{ title }}</b></h4>
      <p>Type: 
      <span :style="{backgroundColor:getTypeStyle }" class="badge">{{ type || 'n/a' }}</span>
      </p>
      <p>Ages: {{ ages }}</p>
      <p>Related resources: {{ resourcesRelatedNumber }}</p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
}

.card:hover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.274);
}

.container-card {
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 10px;
}
.badge {
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
}
</style>
