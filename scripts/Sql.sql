Drop table if exists [Orders];
CREATE TABLE IF NOT EXISTS Orders (
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrderDate] [datetime] NOT NULL,
	[OrderMemberID] [int] NOT NULL,
	[OrderSellerID] [int] NOT NULL,
	[MemberPhoneNumber] [nvarchar](16) ,
	[OrderSum] [numeric](18, 2) NULL,
	[OrderSumOk] [numeric](18, 2) NULL,
	[OrderPoint] [numeric](18, 2) NULL,
	[OrderPay] [numeric](18, 2) NULL,
	[OrderPayPoint] [numeric](18, 2) NULL,
	[OrderPayCash] [numeric](18, 2) NULL,
	[OrderStatus] [int] NOT NULL,
	[OrderUpdateOn] [datetime] NULL,
	[OrderDateUpload] [datetime] NULL,
	[OrderNum] [int] NULL,
	primary key([ID])
);