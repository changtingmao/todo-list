<template>
  <div id="app">
    <el-card class="todo-box">
      <div slot="header">
        <span>TO-DO LIST</span>
      </div>
      <!-- row -->
      <el-row :gutter="10">
        <!-- 左欄 -->
        <el-col :span="18">
          <!-- collapse -->
          <el-collapse
            v-model="activeNames"
            class="todo-input-wrapper"
            accordion
          >
            <el-collapse-item class="todo-input-wrapper" name="1">
              <template slot="title">
                <!-- todo input -->
                <el-input
                  v-model="newTodo"
                  @click.native.stop
                  @keyup.enter.native.stop="addTodo"
                  placeholder="請輸入To-Do項目"
                ></el-input>
              </template>
              <el-form ref="form">
                <!-- 期限 -->
                <el-form-item>
                  <template slot="label">
                    <i class="el-icon-date"></i> 期限
                  </template>
                  <el-date-picker
                    size="mini"
                    v-model="selectedDate"
                    type="date"
                    placeholder="請選擇日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <!-- 右欄 -->
        <el-col :span="6">
          <!-- 新增按鈕 -->
          <el-button class="todo-add-button" @click="addTodo">新增</el-button>
        </el-col>
      </el-row>
      <!-- row -->
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <ul class="todo-list">
            <li
              :class="[
                { complete: todo.complete, editing: todo == editedTodo },
                'todo-item',
              ]"
              :key="todo.id"
              v-for="todo in todoList"
            >
              <div class="view">
                <!-- checkbox -->
                <el-checkbox
                  class="todo-title"
                  @change="toggle(todo)"
                  :checked="todo.complete"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="'期限: ' + todo.deadline"
                    placement="top"
                  >
                    <i
                      v-if="todo.deadline"
                      :class="[
                        'el-icon-warning-outline',
                        { 'is-warning': todo.deadline <= today },
                      ]"
                    ></i>
                  </el-tooltip>
                  {{ todo.title }}
                </el-checkbox>
                <!-- editing button -->
                <a
                  class="todo-button todo-edit-button"
                  href="javascript:void(0);"
                  @click="editTodo(todo)"
                >
                  <i class="el-icon-edit"></i>
                </a>
                <!-- removing button -->
                <el-popconfirm
                  title="確定要刪除嗎?"
                  @confirm="removeTodo(todo)"
                >
                  <a
                    slot="reference"
                    class="todo-button todo-remove-button"
                    href="javascript:void(0);"
                  >
                    <i class="el-icon-delete"></i>
                  </a>
                </el-popconfirm>
              </div>
              <div class="edit-wrapper">
                <!-- editing input field -->
                <el-input
                  style="max-width: calc(100% - 60px)"
                  v-model="todo.title"
                  v-todo-focus="todo == editedTodo"
                  @blur="doneEdit(todo)"
                  @keyup.enter.native="doneEdit(todo)"
                  @keyup.esc.native="cancelEdit(todo)"
                  placeholder="請輸入內容"
                ></el-input>
                <!-- saving button -->
                <a
                  class="todo-button todo-edit-button"
                  href="javascript:void(0);"
                  @click="editTodo(todo)"
                >
                  <i class="el-icon-check"></i>
                </a>
                <!-- canceling button -->
                <a
                  class="todo-button todo-remove-button"
                  href="javascript:void(0);"
                  @click="cancelEdit(todo)"
                >
                  <i class="el-icon-close"></i>
                </a>
              </div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
const STORAGE_KEY = "TO-DO-LIST";
let todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

export default {
  name: "app",
  data() {
    return {
      newTodo: "",
      todoList: todoStorage.fetch(),
      selectedDate: new Date(),
      activeNames: null,
      editedTodo: null,
      beforeEditCache: null,
    };
  },
  methods: {
    addTodo: function () {
      let newTodo = this.newTodo && this.newTodo.trim();
      if (!newTodo) {
        this.$message("請輸入To-Do項目");
        return;
      }

      let _deadline =
        this.activeNames && this.selectedDate ? this.deadline : null;

      this.todoList.push({
        id: todoStorage.uid++,
        title: newTodo,
        complete: false,
        deadline: _deadline,
      });
      this.newTodo = "";
      this.selectedDate = new Date();
    },
    removeTodo: function (todo) {
      var index = this.todoList.indexOf(todo);
      this.todoList.splice(index, 1);
      console.log(this.todoList);
    },
    editTodo: function (todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },
    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },
    cancelEdit: function (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    toggle: function (todo) {
      todo.complete = !todo.complete;
    },
  },
  computed: {
    today: function () {
      return this.$dateFormatDash(new Date());
    },
    deadline: function () {
      return this.$dateFormatDash(this.selectedDate);
    },
  },
  watch: {
    todoList: {
      handler: function (todoList) {
        todoStorage.save(todoList);
      },
      deep: true,
    },
  },
  directives: {
    "todo-focus": function (el, binding) {
      if (binding.value) {
        el.querySelector("input").focus();
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/scss/main.scss";
</style>