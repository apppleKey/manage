<template>
  <div v-loading="loading">
    <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="工作记录" name="list">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed label="日期" width="150">
            <template slot-scope="scope">{{ scope.row.create_date|formatTime('YMD')}}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="nice_name" label="详细信息">
          
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="readItem(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="editItem(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加" name="edit">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="员工姓名">
             <el-input type="text" v-model="form.name">
            <el-input type="text" v-model="form.name"></el-input>

             </el-input>

          </el-form-item>

          <el-form-item label="工作内容">
            <el-input type="text" v-model="form.nice_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addItem">立即录入</el-button>
            <el-button @click="clearForm">清空</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "list",
      form: {
        name: "",
        nice_name: ""
      },
      tableData: [],
      loading: false,
      users: []
    };
  },
  created() {
    this.getUsers();
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$http
        .get("/api/user/list")
        .then(res => {user
          this.loading = false;
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getUsers() {
      this.loading = true;
      this.$http
        .get("/api/user/list")
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    tabClick(...arg) {
      console.log(this.activeName);
    },
    handleClick(row) {
      console.log(row);
    },
    addItem() {
      this.$http({
        url: "/api/user/add",
        method: "POST",
        data: {
          name: this.form.name,
          nice_name: this.form.nice_name,
          
        }
      }).then(res => {
        console.log(res);
this.clearForm()
this.$message.success(res.msg)
      });
    },
    clearForm() {
      this.form.nice_name = "";
      this.form.name = "";
    }
  }
};
</script>

<style>
</style>