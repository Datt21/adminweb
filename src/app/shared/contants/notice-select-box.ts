export class NoticeDataSelectBox {
  public static userDomain = [
    {
      value: 1,
      label: "全員",
    },
    {
      value: 2,
      label: "期間中にアプリ起動なし",
    },
    {
      value: 3,
      label: "期間中に一回以上アプリ起動あり",
    },
    {
      value: 4,
      label: "CSV/CSVファイル読み込み",
    },
  ];

  public static publicFlag = [
    {
      value: 2,
      label: "全て",
    },
    {
      value: 1,
      label: "公開",
    },
    {
      value: 0,
      label: "非公開",
    },
  ];

  public static type = [
    {
      value: null,
      label: "",
    },
    {
      value: 1,
      label: "詳細画面文言入力",
    },
    {
      value: 2,
      label: "Webリンク登録",
    },
  ];

  public static displayPlaceList = [
    {
      value: 1,
      label: "プッシュ通知",
    },
    {
      value: 2,
      label: "お知らせ",
    },
    {
      value: 3,
      label: "広告",
    },
    {
      value: 4,
      label: "メールを送る",
    },
  ];
}
