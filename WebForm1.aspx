<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UcFooterPaging2.ascx.cs" Inherits="Eleooo.Web.Controls.UcFooterPaging2" %>
<script runat="server" language="c#">
    protected const int MaxPagingLimit = 10;
    protected int GetStartIndex()
    {
        var index = PageIndex - (PageIndex - 1) % MaxPagingLimit;
        if (index + MaxPagingLimit > PageCount && PageCount > MaxPagingLimit)
            return PageCount - MaxPagingLimit;
        else
            return index;
    }
    protected int GetEndIndex()
    {
        var index = GetStartIndex() + MaxPagingLimit;
        if (index > PageCount)
            return PageCount;
        else
            return index;
    }
</script>
<p class="pager">
    <a href="javascript:FaceBook.showFaceBook('<%=PageIndex -1 %>')">上一页</a>
    <%for (int i = GetStartIndex(); i <= GetEndIndex(); i++)
          {
              if (i == PageIndex)
              {%>
    <a href="javascript:FaceBook.showFaceBook('<%=i %>')" class="current">
        <%=i%></a>
    <%}
              else
              { %>
    <a href="javascript:FaceBook.showFaceBook('<%=i %>')">
        <%=i%></a>
    <%}
          } %>
    <a href="javascript:FaceBook.showFaceBook('<%=PageIndex +1 %>')">下一页</a>
</p>
