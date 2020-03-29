<template>
  <div v-loading="loading">
    <div style="padding:20px">
      <!-- 姓名：
        <el-select v-model="searchUid" @change="search" filterable placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.Id"
            :label="item.name+`(${item.nice_name})`"
            :value="item.Id"
          ></el-option>
      </el-select>-->

      <el-row>
        <el-col :span="2">关键词：</el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input v-model="keyword" @change="search"></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-button @click="search">搜索</el-button>
            <el-button type="default" @click="addDialogVisible=true">创建</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- <el-button type="danger" @click="clearForm">清空</el-button> -->
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="日期" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.create_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120">
        <template slot-scope="scope">
          <div v-html="htmlFormate(scope.row.title)"></div>
        </template>
      </el-table-column>
      <el-table-column label="详细信息">
        <template slot-scope="scope">
          <div v-html="htmlFormate(scope.row.details)"></div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="viewItem(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="editItem(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详细信息" :visible.sync="viewDialogVisible" :modal-append-to-body="false">
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">姓名</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div class="grid-content bg-purple-light tal">{{viewForm.user_name}}</div>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">创建时间</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div class="grid-content bg-purple-light tal">{{viewForm.create_date|formatTime('YMD')}}</div>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">工作内容</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div
            class="grid-content bg-purple-light tal"
            v-html="viewForm.details&&viewForm.details.replace(/\n/g,'<br/>')"
          ></div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDialogVisible = false">好的</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="创建笔记"
      :visible.sync="addDialogVisible"
      :modal-append-to-body="false"
      width="800"
    >
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="addForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="笔记内容">
          <!-- <el-input type="textarea" v-model="addForm.details" autocomplete="off"></el-input> -->
          <vue-html5-editor
            :content="addForm.details"
            :height="500"
            :z-index="4000"
            @change="editorUpdate"
            :auto-height="true"
            :show-module-name="false"
          ></vue-html5-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addItemSubmit">确定</el-button>
        <el-button type="default" @click="addDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" autocomplete="off" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <vue-html5-editor
            :content="editForm.details"
            :height="500"
            :z-index="4000"
            @change="editor2Update"
            :auto-height="true"
            :show-module-name="false"
          ></vue-html5-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editItemSubmit">确定</el-button>
        <el-button type="default" @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      activeName: "list",
      viewDialogVisible: false,
      addDialogVisible: false,
      viewForm: {},
      editDialogVisible: false,
      editForm: {},
      addForm: {},
      form: {},
      tableData: [],
      loading: false,
      users: []
    };
  },
  created() {
    this.getUsers();
    this.getData();
    //   var a=`
    //   111111111111
    //   111001100111
    //   110000000011
    //   100000000001
    //   000000000000
    //   100000000001
    //   110000000011
    //   111100001111
    //   111110011111
    //   111111111111
    //   `
    //   var a=`
    //   11111111111
    //   11101000000
    //   11011000101
    //   10011010101
    //   01011010101
    //   11011010101
    //   11011000101
    //   11011111101
    //   11011110011
    //   11111111111

    //   00000000000
    //   00100111110
    //   01110001000
    //   10000001000
    //   01110111110
    //   00100001000
    //   01110001010
    //   00100001001
    //   00110111110
    //   00000000000
    //   `

    //  window.b=a.replace(/1/g,'[拥抱]').replace(/0/g,'[玫瑰]').replace(/\n|\s/g,'');
    // console.log(b)
  },
  methods: {
    editorUpdate(e) {
      this.addForm.details = e;
    },
    editor2Update(e) {
      this.editForm.details = e;
    },
    htmlFormate(str) {
      str = str.replace(/\n/g, "<br/>");
      if (this.keyword) {
        str = str.replace(new RegExp(this.keyword, "gi"), function(val) {
          return "<span style='color:red;'>" + val + "</span>";
        });
      }
      str= str.replace(/kinglive-\d+/gi, function(val) {
          return "<a href='https://jira.itech8.net:4443/browse/"+val+"'>" + val + "</a>";
        });
      str= str.replace(/esport-\d+/gi, function(val) {
          return "<a href='https://jira.itech8.net:4443/browse/"+val+"'>" + val + "</a>";
        });
      return str;
    },
    getData() {
      this.loading = true;
      this.$http
        .get("/api/note/list")
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    search() {
      this.loading = true;
      this.$http
        .get("/api/note/search", { params: { keyword: this.keyword } })
        .then(res => {
          this.loading = false;

          res.data.map((v, i) => {
            res.data[i].title = v.title.replace(
              new RegExp(this.keyword, "gi"),
              function(val) {
                return "<span style='color:red;'>" + val + "</span>";
              }
            );
            res.data[i].details = v.details.replace(
              new RegExp(this.keyword, "gi"),
              function(val) {
                return "<span style='color:red;'>" + val + "</span>";
              }
            );

            console.log(v.title);
          });
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    clearForm() {
      this.searchUid = null;
      this.getData();
    },
    getUsers() {
      this.loading = true;
      this.$http
        .get("/api/user/list")
        .then(res => {
          this.loading = false;
          this.users = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    viewItem(item) {
      this.viewDialogVisible = true;
      this.viewForm = JSON.parse(JSON.stringify(item));
    },
    editItem(item) {
      this.editDialogVisible = true;
      this.editForm = JSON.parse(JSON.stringify(item));
    },
    editItemSubmit() {
      var form = this.editForm;
      console.log(this.editForm);
      this.$http({
        url: "/api/note/edit",
        method: "POST",
        data: {
          details: form.details,
          title: form.title,

          id: form.Id
        }
      })
        .then(res => {
          this.$message.success(res.msg);
          this.getData();
          this.editDialogVisible = false;
        })
        .catch(err => {
          console.log(err);
          // this.$message.success(err.msg || err);
        });
    },
    deleteItem(item) {
      this.$confirm("删除该项？")
        .then(() => {
          return this.$http({
            url: "/api/note/delete",
            method: "POST",
            data: {
              id: item.Id
            }
          });
        })
        .then(res => {
          this.$message.success(res.msg);
          this.getData();
        })
        .catch(err => {
          console.log(err);
          // this.$message.success(err.msg || err);
        });
    },
    addItemSubmit() {
      this.$http({
        url: "/api/note/add",
        method: "POST",
        data: {
          title: this.addForm.title,
          details: this.addForm.details
        }
      }).then(res => {
        console.log(res);
        this.addForm = {};
        this.getData();
        this.addDialogVisible = false;
        this.$message.success(res.msg);
      });
    }
  }
};
</script>

<style>
</style>