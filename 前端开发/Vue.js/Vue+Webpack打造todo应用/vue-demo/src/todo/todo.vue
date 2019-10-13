<template>
  <section class="real-app">
    <input 
        type="text"
        class="add-input"
        autofocus="autofocus"
        placeholder="接下去要做什么？"
        @keyup.enter="addTodo"
    >
    <!-- <item :todo="todo"></item> -->
    <item :todo="todo" v-for="todo in todos" :key="todo.id" @del="deleteTodo"></item>
    <tabs 
    :filter="filter" 
    :todos="todos"
    @toggle="toggleFilter"
    @clearAllCompleted = "clearAllCompleted"
    />
  </section>
 
</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0;
export default {
    data(){
        return {
            todos:[],
            // todo:{
            //     id:0,
            //     content:'this is todo',
            //     completed:false
            // },
            filter:'all'
        }
    },
    computed: {
        filteredTodos(){
            if(this.filter===all){
                return this.todos
            }
            const completed =this.filter==='completed'
            return this.todos.filter(todo=>completed ===todo.completed)
        }
    },
  methods: {
      addTodo(e){
          this.todos.unshift({
              id:id+1,
              content:e.target.value.trim(),
              completed:false
          })
          e.target.value = ''
      },
      deleteTodo(id){
          this.todos.splice(this.todos.findIndex(todo=>todo.id===id),1)
      },
      toggleFilter(state){
          this.filter = state
      },
      clearAllCompleted(){
          this.todos = this.todos.filter(todo=>!todo.completed)
      }
  },
  components: {
      Item,
      Tabs
  }
}
</script>
<style lang="stylus" scoped>
.real-app{
    width 600px
    margin 0 auto 
    box-shadow 0 0 5px #666
}
.add-input{
    position: relative;
    padding 10px
    width 600px
    font-size 20px
}
</style>
