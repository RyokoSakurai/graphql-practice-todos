//ApolloServerはgraphQLという概念？を実装する場所
//gqlとはgraph query language
//require(...)でモジュール化されたjsファイルを読み込む
const {ApolloServer, gql} = require('apollo-server')

/**
* GraphQLのSchema（データ構造）
*/
const typeDefs = gql`
  "タスク"
  type Task{
    "タスクのID"
    id: ID!
    "タスク名"
    name: String!
    "期限(YYYY-MM-DD hh:mm:ss)"
    expiresAt: String!
    "完了フラグ(完了していればtrue)"
    done: Boolean!
    "緊急タスクかどうか"
    urgent: Boolean!
  }

  "クエリ"
  type Query{
    "すべてのタスク"
    allTasks: [Task!]!
    "完了済タスク"
    finishedTasks: [Task!]!
    "未完了タスク"
    unfinishedTasks: [Task!]!
    "IDからタスクを取得"
    taskByID(
      "取得したいタスクのID"
      id: ID!
    ): Task
  }
`;

/**
* タスクを管理する内部配列
*/
const tasks = [
    {
      id: 'd1947409-95b4-4a46-8e83-cc60b94d3dd4',
      name: '牛乳を買う',
      expiresAt: '2020-01-23 20:00:00',
      done: true
    },
    {
      id:'97dcafa7-53d3-47b0-b25f-8457577749c8',
      name: 'Qiitaに投稿する',
      expiresAt: '2020-01-25 22:00:00',
      done: false
    }
  ];
  const moment = require('moment');
  /**
  * GraphQLのResolver（このドメイン名のIPアドレスは何？とかをDNSサーバに聞いてくれるやつ）
  */
  const resolvers = {
    /**
    * "Query"ノードについてのResolver
    */
    Query: {
      /**
      * すべてのタスク
      */
      allTasks: () => tasks,
      /**
      * 完了済タスク（taskがtrueのやつ）
      */
      finishedTasks: ()=> tasks.filter(task => task.done),
      /**
      * 未完了タスク（taskがfalseのやつ）
      */
      unfinishedTasks: ()=> tasks.filter(task => !task.done),
      /**
      * IDからタスクを取得する
      * Schemaで定義したパラメータは第２引数のargsオブジェクトの中に格納される点に注意
      * tasksの中からtask.idとargs.idが一致するtaskを見つける
      * (_, args)の_,は何を示しているんだろう      */
      taskByID: (_, args) => tasks.find(task => task.id === args.id)
    },
    /**
  * "Task"ノードについてのResolver
  */
     Task:{
      /**
    * taskがurgent(緊急)かどうか
    * urgentノードに割り当てられたResolver
    * @param {Object} task タスク(Resolverの第１引数には"親ノード"が渡される)
    * @return {Boolean} taskがurgentであればtrue
    */
    urgent: (task) => !task.done && moment().add(8,"hours").isAfter(task.expiresAt)
     }
  };
  
  //定義したSchema(typeDefs)とRosolversを使用してApolloServerを作成
  const server = new ApolloServer({typeDefs, resolvers});
  
  //作成したApolloServerの起動（デフォルトポートは4000）
  //listenメソッドでサーバを待ち受け状態にする
  //thenメソッドでserver(apolloserverインスタンス)が成功したときに受け取った引数を返す
  server.listen().then(({url}) => console.log(`Server ready at ${url}`));